// Type declarations for packages without built-in types

declare module 'react-native-voice' {
  interface VoiceEvent {
    value?: string[];
  }

  interface VoiceError {
    error?: { message?: string };
  }

  const Voice: {
    start: (locale?: string) => Promise<void>;
    stop: () => Promise<void>;
    cancel: () => Promise<void>;
    destroy: () => Promise<void>;
    isAvailable: () => Promise<boolean>;
    onSpeechStart?: (e: VoiceEvent) => void;
    onSpeechEnd?: (e: VoiceEvent) => void;
    onSpeechResults?: (e: VoiceEvent) => void;
    onSpeechPartial?: (e: VoiceEvent) => void;
    onSpeechError?: (e: VoiceError) => void;
    onSpeechVolumeChanged?: (e: VoiceEvent) => void;
  };

  export default Voice;
}

declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import { Component } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  export default class Icon extends Component<IconProps> {}
}

declare module 'react-native-chart-kit' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';

  interface Dataset {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }

  interface ChartData {
    labels: string[];
    datasets: Dataset[];
  }

  interface PieData {
    name: string;
    population: number;
    color: string;
    legendFontColor?: string;
    legendFontSize?: number;
  }

  interface ChartConfig {
    backgroundColor?: string;
    backgroundGradientFrom?: string;
    backgroundGradientTo?: string;
    decimalPlaces?: number;
    color?: (opacity?: number) => string;
    labelColor?: (opacity?: number) => string;
    style?: ViewStyle;
    propsForDots?: any;
    propsForLabels?: any;
    fillShadowGradient?: string;
    fillShadowGradientOpacity?: number;
    barPercentage?: number;
    fromZero?: boolean;
    useShadowColorFromDataset?: boolean;
  }

  interface LineChartProps {
    data: ChartData;
    width: number;
    height: number;
    chartConfig: ChartConfig;
    style?: ViewStyle;
    bezier?: boolean;
    withInnerLines?: boolean;
    withOuterLines?: boolean;
    fromZero?: boolean;
    yAxisLabel?: string;
    yAxisSuffix?: string;
  }

  interface BarChartProps {
    data: ChartData;
    width: number;
    height: number;
    chartConfig: ChartConfig;
    style?: ViewStyle;
    fromZero?: boolean;
    showValuesOnTopOfBars?: boolean;
    yAxisLabel?: string;
    yAxisSuffix?: string;
  }

  interface PieChartProps {
    data: PieData[];
    width: number;
    height: number;
    chartConfig: ChartConfig;
    accessor?: string;
    backgroundColor?: string;
    paddingLeft?: string;
    absolute?: boolean;
  }

  export class LineChart extends Component<LineChartProps> {}
  export class BarChart extends Component<BarChartProps> {}
  export class PieChart extends Component<PieChartProps> {}
}

declare module 'react-native-gesture-handler' {
  export * from 'react-native-gesture-handler/lib/typescript/index';
}
