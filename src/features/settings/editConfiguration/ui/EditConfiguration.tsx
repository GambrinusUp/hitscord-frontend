import { Group, Slider, Stack, Switch, Text, Title } from '@mantine/core';

import { useMediaContext } from '~/context';
import { useAudioSettings } from '~/shared/lib/hooks';

export const EditConfiguration = () => {
  const { micSettings, setMicSettings } = useMediaContext();
  const { volume, volumePercent, setNotificationVolume } = useAudioSettings();

  return (
    <Stack p="xl" gap="md" w="100%">
      <Title order={2}>Настройки микрофона</Title>
      <Stack gap="md">
        <Stack gap={6}>
          <Group justify="space-between">
            <Text size="sm">Громкость</Text>
            <Text size="sm" c="dimmed">
              {micSettings.volume}%
            </Text>
          </Group>
          <Slider
            min={0}
            max={100}
            step={1}
            value={micSettings.volume}
            onChange={(value) =>
              setMicSettings((prev) => ({ ...prev, volume: value }))
            }
          />
        </Stack>
        <Stack gap={6}>
          <Group justify="space-between">
            <Text size="sm">Gain</Text>
            <Text size="sm" c="dimmed">
              {micSettings.gainDb} dB
            </Text>
          </Group>
          <Slider
            min={-10}
            max={20}
            step={1}
            value={micSettings.gainDb}
            onChange={(value) =>
              setMicSettings((prev) => ({ ...prev, gainDb: value }))
            }
          />
        </Stack>
        <Switch
          label="Шумоподавление"
          checked={micSettings.noiseSuppression}
          onChange={(event) =>
            setMicSettings((prev) => ({
              ...prev,
              noiseSuppression: event.currentTarget.checked,
            }))
          }
        />
        <Switch
          label="Эхоподавление"
          checked={micSettings.echoCancellation}
          onChange={(event) =>
            setMicSettings((prev) => ({
              ...prev,
              echoCancellation: event.currentTarget.checked,
            }))
          }
        />
        <Switch
          label="Автоусиление"
          checked={micSettings.autoGainControl}
          onChange={(event) =>
            setMicSettings((prev) => ({
              ...prev,
              autoGainControl: event.currentTarget.checked,
            }))
          }
        />
      </Stack>
      <Title order={2}>Настройки звука уведомлений</Title>
      <Stack gap={6}>
        <Group justify="space-between">
          <Text size="sm">Громкость уведомлений</Text>
          <Text size="sm" c="dimmed">
            {volumePercent}%
          </Text>
        </Group>
        <Slider
          min={0}
          max={0.525}
          step={0.035}
          value={volume}
          onChange={setNotificationVolume}
          label={(value) => `${Math.round((value / 0.35) * 100)}%`}
        />
      </Stack>
    </Stack>
  );
};
