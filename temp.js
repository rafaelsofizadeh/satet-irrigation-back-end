function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1);
}

(async function chart(apiParams, graphFields) {
  const jsonData = await weatherApiRequest(...apiParams);

  const schema = [
    { name: "Date", type: "date", format: "%Y-%m-%dT%H:%M:%S.%LZ" },
  ];
  graphFields.forEach(({ field }) => {
    schema.push({ name: capitalize(field), type: "number" });
  });

  const yAxisConfig = graphFields.map(({ field, suffix }) => ({
    plot: {
      value: capitalize(field),
      connectnulldata: true,
      type: "line",
    },
    format: { suffix },
  }));

  const graphData = prepareGraphData(jsonData, [
    "observation_time",
    ...graphFields.map(({ field }) => field),
  ]);

  const dataStore = new FusionCharts.DataStore();
  const dataSource = {
    chart: {
      multicanvas: false,
    },
    caption: {
      text: "Weather Measurements",
    },
    yaxis: yAxisConfig,
  };
  dataSource.data = dataStore.createDataTable(graphData, schema);

  new FusionCharts({
    type: "timeseries",
    renderAt: "chart-wrapper",
    width: "100%",
    height: "500",
    dataSource: dataSource,
  }).render();
})(
  [
    38.6652234,
    48.8064696,
    new Date(),
    getStartOfNextDay(),
    ["temp", "humidity"],
  ],
  [
    { field: "temp", suffix: " C" },
    { field: "humidity", suffix: "%" },
  ]
);
