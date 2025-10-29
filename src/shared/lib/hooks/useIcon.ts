import { useEffect, useState } from 'react';

import { getIcon } from '~/entities/files';

const iconCache = new Map<string, string>();

export const useIcon = (fileId?: string, options: { skip?: boolean } = {}) => {
  const [iconBase64, setIconBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (options.skip || !fileId) {
      setIconBase64(null);

      return;
    }

    if (iconCache.has(fileId)) {
      setIconBase64(iconCache.get(fileId)!);

      return;
    }

    const fetchIcon = async () => {
      setLoading(true);
      setError(null);

      try {
        const iconData = await getIcon(fileId);
        const dataUrl = `data:${iconData.fileType};base64,${iconData.base64File}`;

        iconCache.set(fileId, dataUrl);
        setIconBase64(dataUrl);
      } catch (err) {
        console.error('Error fetching icon:', err);
        setError('Failed to load icon');
        setIconBase64(null);
      } finally {
        setLoading(false);
      }
    };

    fetchIcon();
  }, [fileId, options.skip]);

  const refetch = async () => {
    if (!fileId) return;

    iconCache.delete(fileId);

    setLoading(true);
    try {
      const iconData = await getIcon(fileId);
      const dataUrl = `data:${iconData.fileType};base64,${iconData.base64File}`;
      iconCache.set(fileId, dataUrl);
      setIconBase64(dataUrl);
    } catch (err) {
      console.error('Error refetching icon:', err);
      setError('Failed to reload icon');
    } finally {
      setLoading(false);
    }
  };

  return {
    iconBase64,
    loading,
    error,
    refetch,
    isEmpty: !fileId,
  };
};
