import {
  Autocomplete,
  Title,
  Box,
  Container,
  Badge,
  Group,
  Text,
  Paper,
  ActionIcon,
  Tooltip,
  RingProgress,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import { axiosInstance } from "./utils/axios.instance";
import { IconBrandGithub, IconPackage, IconWorld } from "@tabler/icons";
import dayjs from "dayjs";
import getPercentage from "./utils/getPercentage";

function App() {
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [packageData, setPackageData] = useState([]);
  const [debounced] = useDebouncedValue(value, 400);
  const mediaLg = useMediaQuery("(min-width: 992px)");

  useEffect(() => {
    debounced &&
      axiosInstance
        .get(`/search?q=${encodeURIComponent(debounced)}`)
        .then((data) => {
          const dataArray = data.data.results.map((item) => item.package.name);
          setData(dataArray);
        });
  }, [debounced]);

  return (
    <Box className="App">
      <Box sx={{ paddingBlock: "3.5rem", textAlign: "center" }}>
        <Title
          order={1}
          size={mediaLg ? 60 : 24}
          sx={{ marginBlockEnd: "2rem" }}
        >
          NPM Package Scanner
        </Title>
        <Box
          sx={{
            inlineSize: "100%",
            maxInlineSize: "600px",
            marginInline: "auto",
            paddingInline: "1.5rem",
          }}
        >
          <Autocomplete
            value={value}
            onChange={setValue}
            onItemSubmit={(item) => {
              axiosInstance
                .get(`/package/${encodeURIComponent(item.value)}`)
                .then((data) => {
                  setPackageData(data.data);
                  setSelectedItem(item.value);
                });
            }}
            size={mediaLg ? "xl" : "md"}
            limit={100}
            autoComplete="off"
            placeholder="Enter a package name"
            icon={<IconPackage />}
            maxDropdownHeight={400}
            data={data}
          />
        </Box>

        {selectedItem ? (
          <Container mt={mediaLg ? 48 : 32}>
            <Paper
              withBorder
              p={mediaLg ? 32 : 20}
              sx={{
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Group mb="sm" position="apart" sx={{ alignItems: "center" }}>
                <Group spacing="md">
                  <Title size={mediaLg ? 40 : 24}>{selectedItem}</Title>
                  <Badge size={mediaLg ? "xl" : "md"}>
                    {packageData.collected.metadata.version}
                  </Badge>
                </Group>

                {packageData.collected.metadata.repository && (
                  <Group>
                    {packageData.collected.metadata.links.npm && (
                      <Tooltip label="npm page">
                        <ActionIcon
                          component="a"
                          href={packageData.collected.metadata.links.npm}
                          target="_blank"
                        >
                          <IconPackage />
                        </ActionIcon>
                      </Tooltip>
                    )}

                    {packageData.collected.metadata.repository.url && (
                      <Tooltip label="GitHub Repository">
                        <ActionIcon
                          component="a"
                          href={packageData.collected.metadata.repository.url}
                          target="_blank"
                        >
                          <IconBrandGithub />
                        </ActionIcon>
                      </Tooltip>
                    )}

                    {packageData.collected.metadata.links.homepage && (
                      <Tooltip label="Website/Homepage">
                        <ActionIcon
                          component="a"
                          href={packageData.collected.metadata.links.homepage}
                          target="_blank"
                        >
                          <IconWorld />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </Group>
                )}
              </Group>

              {packageData.collected.metadata.keywords && (
                <Group spacing={3} mb="lg">
                  {packageData.collected.metadata.keywords.map((item) => (
                    <Badge key={item} size="sm">
                      {item}
                    </Badge>
                  ))}
                </Group>
              )}
              <Text size="xs" mb="sm">
                Last Updated:{" "}
                <Text component="span" color="dimmed">
                  {dayjs(packageData.collected.metadata.date).format(
                    "MMM D, YYYY h:mm A"
                  )}
                </Text>
              </Text>

              <Text mt={mediaLg ? "lg" : "md"}>
                {packageData.collected.metadata.description}
              </Text>

              {packageData.collected.github && (
                <Paper withBorder my={mediaLg ? 24 : 32} p="xl" radius="md">
                  <Title order={6} mb="lg">
                    GitHub Data
                  </Title>
                  <Group spacing={mediaLg ? 48 : 20}>
                    <Box>
                      <Title order={3}>
                        {packageData.collected.github.starsCount}
                      </Title>
                      <Text color="dimmed" size="sm">
                        Stars
                      </Text>
                    </Box>

                    <Box>
                      <Title order={3}>
                        {packageData.collected.github.forksCount}
                      </Title>
                      <Text color="dimmed" size="sm">
                        Forks
                      </Text>
                    </Box>

                    {packageData.collected.github.issues && (
                      <Box>
                        <Title order={3}>
                          {packageData.collected.github.issues.openCount}
                        </Title>
                        <Text color="dimmed" size="sm">
                          Open Issues
                        </Text>
                      </Box>
                    )}
                  </Group>
                </Paper>
              )}

              {packageData.score && (
                <Group mt={mediaLg ? 48 : 24} spacing={mediaLg ? "lg" : "sm"}>
                  <Box sx={{ textAlign: "center" }}>
                    <Text size="sm" color="dimmed">
                      Package Score
                    </Text>
                    <RingProgress
                      size={88}
                      sections={[
                        {
                          value: getPercentage(packageData.score.final, 1),
                          color:
                            getPercentage(packageData.score.final, 1) > 80
                              ? "green"
                              : getPercentage(packageData.score.final, 1) > 50
                              ? "orange"
                              : "red",
                        },
                      ]}
                      label={
                        <Text weight={400} align="center" size="sm">
                          {`${Math.round(
                            getPercentage(packageData.score.final, 1)
                          )}%`}
                        </Text>
                      }
                    />
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <Text size="sm" color="dimmed">
                      Quality
                    </Text>
                    <RingProgress
                      size={88}
                      sections={[
                        {
                          value: getPercentage(
                            packageData.score.detail.quality,
                            1
                          ),
                          color:
                            getPercentage(packageData.score.detail.quality, 1) >
                            80
                              ? "green"
                              : getPercentage(
                                  packageData.score.detail.quality,
                                  1
                                ) > 50
                              ? "orange"
                              : "red",
                        },
                      ]}
                      label={
                        <Text weight={400} align="center" size="sm">
                          {`${Math.round(
                            getPercentage(packageData.score.detail.quality, 1)
                          )}%`}
                        </Text>
                      }
                    />
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <Text size="sm" color="dimmed">
                      Popularity
                    </Text>
                    <RingProgress
                      size={88}
                      sections={[
                        {
                          value: getPercentage(
                            packageData.score.detail.popularity,
                            1
                          ),
                          color:
                            getPercentage(
                              packageData.score.detail.popularity,
                              1
                            ) > 80
                              ? "green"
                              : getPercentage(
                                  packageData.score.detail.popularity,
                                  1
                                ) > 50
                              ? "orange"
                              : "red",
                        },
                      ]}
                      label={
                        <Text weight={400} align="center" size="sm">
                          {`${Math.round(
                            getPercentage(
                              packageData.score.detail.popularity,
                              1
                            )
                          )}%`}
                        </Text>
                      }
                    />
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <Text size="sm" color="dimmed">
                      Maintenance
                    </Text>
                    <RingProgress
                      size={88}
                      sections={[
                        {
                          value: getPercentage(
                            packageData.score.detail.maintenance,
                            1
                          ),
                          color:
                            getPercentage(
                              packageData.score.detail.maintenance,
                              1
                            ) > 80
                              ? "green"
                              : getPercentage(
                                  packageData.score.detail.maintenance,
                                  1
                                ) > 50
                              ? "orange"
                              : "red",
                        },
                      ]}
                      label={
                        <Text weight={400} align="center" size="sm">
                          {`${Math.round(
                            getPercentage(
                              packageData.score.detail.maintenance,
                              1
                            )
                          )}%`}
                        </Text>
                      }
                    />
                  </Box>
                </Group>
              )}
            </Paper>
          </Container>
        ) : null}
      </Box>
    </Box>
  );
}

export default App;
