import React, { useEffect } from 'react';
import { Stock } from '@antv/g2plot';
//使用npm install @antv/g2plot --save安装

const Chart = ({ dataDic }) => {
  useEffect(() => {
    const stockPlot = new Stock('container', {
      data: dataDic, // 使用传入的 dataDic 作为数据源
      xField: '时间',
      yField: ['开盘', '收盘', '最高', '最低'],
      // 绿涨红跌
      fallingFill: '#ef5350',
      risingFill: '#26a69a',
      
    });

    stockPlot.render();

    // 清理函数
    return () => {
      stockPlot.destroy(); // 在组件卸载时销毁图表，避免内存泄漏
    };
  }, [dataDic]); // 当 dataDic 发生变化时重新渲染图表

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div id="container" style={{ width: '10000vw', height: '80vh' }}></div>
      <div style={{ width: '120vw', height: '100vh' }}></div>
    </div>
  );
  
};

export default Chart;