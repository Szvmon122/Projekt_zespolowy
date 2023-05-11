import React, { useEffect, useState } from "react";
import { convertIntegerToCurrency, groupByCategory, createfilter } from "../utils/index";
import DateInput from "../components/DateInput";
import { PieChart } from "react-native-chart-kit";
import { Dimensions, View, Text } from "react-native";

const Summary = (props) => {
  const [rangeStart, setRangeStart] = useState(new Date());
  const [rangeEnd, setRangeEnd] = useState(new Date());
  const [plotData, setPlotData] = useState([]);
  const [wydatkiGrupowane, setWydatkiGrupowane] = useState({});

  useEffect(() => {
    setWydatkiGrupowane(
      groupByCategory(props.data.filter(createfilter(rangeStart, rangeEnd)))
    );
  }, [props.data, rangeStart, rangeEnd]);

  useEffect(() => {
    setPlotData(
      Object.entries(wydatkiGrupowane).map(([name, arr], i) => ({
        name,
        kwota: arr.reduce((a, b) => a + b.kwota, 0),
        color: `rgba(33,70, 155,${(i + 1) * 0.1})`,
        legendFontColor: `rgba(0,0,0, 1)`,
      }))
    );
  }, [wydatkiGrupowane]);

  return (
    <View style={{ padding: 32, marginRight: 16, flex: 1, gap: "8px" }}>
      <View>
        <View>
          <Text>{rangeStart.toDateString()}</Text>
          <Text>Zakres od:</Text>
          <DateInput onChange={setRangeStart} />
        </View>
        <View>
          <Text>{rangeEnd.toDateString()}</Text>
          <Text>Zakres do:</Text>
          <DateInput onChange={setRangeEnd} />
        </View>
      </View>

      {plotData.length !== 0 && (
        <PieChart
          data={plotData}
          accessor={"kwota"}
          width={Dimensions.get("window").width}
          height={300}
          backgroundColor="transparent"
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",

            color: (opacity = 1, i) => `rgba(0, 0, 0, ${opacity})`,
          }}
        />
      )}
      {plotData.length !== 0 && (
        <View>
          <Text>W wybranym okresie wydałeś łącznie:</Text>
          <Text>
            {convertIntegerToCurrency(
              plotData.reduce((acc, { kwota }) => acc + kwota, 0)
            )}{" "}
            zł
          </Text>
        </View>
      )}
    </View>
  );
};

export default Summary;
