(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  // --- Chart 1: 产业链价值分布 ---
  var chart1 = echarts.init(document.getElementById('chart-chain-value'), null, { renderer: 'svg' });
  chart1.setOption({
    animation: false,
    tooltip: { trigger: 'axis', appendToBody: true, axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['原料生产', '袜机制造', '袜子生产', '批发分销', '物流', '零售', '市场运营\n(收租)'],
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 11, interval: 0, rotate: 15 }
    },
    yAxis: {
      type: 'value',
      name: '毛利率(%)',
      nameTextStyle: { color: muted },
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, formatter: '{value}%' },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: [
        { value: 5, itemStyle: { color: accent } },
        { value: 15, itemStyle: { color: accent } },
        { value: 8, itemStyle: { color: accent } },
        { value: 6, itemStyle: { color: accent2 } },
        { value: 10, itemStyle: { color: accent } },
        { value: 35, itemStyle: { color: accent } },
        { value: 100, itemStyle: { color: accent2 } }
      ],
      barWidth: '45%',
      label: { show: true, position: 'top', color: ink, fontWeight: 'bold', formatter: '{c}%' }
    }]
  });
  window.addEventListener('resize', function() { chart1.resize(); });

  // --- Chart 2: 收入预测 ---
  var chart2 = echarts.init(document.getElementById('chart-revenue'), null, { renderer: 'svg' });
  chart2.setOption({
    animation: false,
    tooltip: { trigger: 'axis', appendToBody: true, axisPointer: { type: 'shadow' } },
    legend: { data: ['第1-2年', '第3-5年'], textStyle: { color: muted }, top: 5 },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true, top: 40 },
    xAxis: {
      type: 'category',
      data: ['物流集采', '原料集采', '袜机服务', '供应链金融', '数据服务', '大唐认证标'],
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 11, interval: 0, rotate: 20 }
    },
    yAxis: {
      type: 'value',
      name: '万元',
      nameTextStyle: { color: muted },
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    series: [
      {
        name: '第1-2年',
        type: 'bar',
        data: [500, 500, 200, 100, 100, 50],
        itemStyle: { color: accent + '99' },
        label: { show: true, position: 'top', color: muted, fontSize: 10, formatter: '{c}' }
      },
      {
        name: '第3-5年',
        type: 'bar',
        data: [1200, 1500, 500, 300, 300, 200],
        itemStyle: { color: accent2 },
        label: { show: true, position: 'top', color: ink, fontSize: 10, formatter: '{c}' }
      }
    ]
  });
  window.addEventListener('resize', function() { chart2.resize(); });

  // --- Chart 3: B2B模式对比雷达图 ---
  var chart3 = echarts.init(document.getElementById('chart-model-compare'), null, { renderer: 'svg' });
  chart3.setOption({
    animation: false,
    tooltip: { appendToBody: true },
    legend: { data: ['1688模式', '钢银模式', '义乌购模式', '大唐产业互联网'], textStyle: { color: muted }, top: 5, type: 'scroll' },
    radar: {
      indicator: [
        { name: '运营轻量度', max: 10 },
        { name: '收入天花板', max: 10 },
        { name: '物理在场优势', max: 10 },
        { name: '品类适配度', max: 10 },
        { name: '数据壁垒', max: 10 },
        { name: '可复制性', max: 10 }
      ],
      shape: 'polygon',
      splitNumber: 5,
      axisName: { color: ink, fontSize: 11 },
      splitLine: { lineStyle: { color: rule } },
      splitArea: { areaStyle: { color: [bg2, 'transparent'] } },
      axisLine: { lineStyle: { color: rule } }
    },
    series: [{
      type: 'radar',
      data: [
        { value: [2, 9, 2, 5, 8, 8], name: '1688模式', areaStyle: { color: accent + '20' }, lineStyle: { color: accent }, itemStyle: { color: accent } },
        { value: [3, 8, 4, 6, 9, 4], name: '钢银模式', areaStyle: { color: accent2 + '20' }, lineStyle: { color: accent2 }, itemStyle: { color: accent2 } },
        { value: [5, 5, 9, 7, 4, 6], name: '义乌购模式', areaStyle: { color: muted + '20' }, lineStyle: { color: muted }, itemStyle: { color: muted } },
        { value: [7, 7, 9, 8, 7, 5], name: '大唐产业互联网', areaStyle: { color: accent + '30' }, lineStyle: { color: accent, width: 2 }, itemStyle: { color: accent } }
      ]
    }]
  });
  window.addEventListener('resize', function() { chart3.resize(); });

  // --- Chart 4: 政府四流考核对应 ---
  var chart4 = echarts.init(document.getElementById('chart-gov-metrics'), null, { renderer: 'svg' });
  chart4.setOption({
    animation: false,
    tooltip: { trigger: 'axis', appendToBody: true, axisPointer: { type: 'shadow' } },
    legend: { data: ['已有覆盖', '平台新增'], textStyle: { color: muted }, top: 5 },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true, top: 40 },
    xAxis: {
      type: 'category',
      data: ['人流', '物流', '资金流', '信息流'],
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: ink, fontSize: 12, fontWeight: 'bold' }
    },
    yAxis: {
      type: 'value',
      name: '数据指标覆盖度',
      nameTextStyle: { color: muted },
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    series: [
      {
        name: '已有覆盖',
        type: 'bar',
        stack: 'total',
        data: [2, 1, 1, 1],
        itemStyle: { color: muted + '60' },
        label: { show: true, color: ink, fontSize: 10 }
      },
      {
        name: '平台新增',
        type: 'bar',
        stack: 'total',
        data: [5, 7, 6, 8],
        itemStyle: { color: accent },
        label: { show: true, color: ink, fontSize: 10 }
      }
    ]
  });
  window.addEventListener('resize', function() { chart4.resize(); });
})();
