// components/FeedbackCharts/FeedbackCharts.jsx
import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter } from 'recharts';
import { FaDownload, FaUser, FaSort, FaSearch, FaQuestion, FaPalette, FaMoon, FaSun, FaComments } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import './FeedbackChart.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const FeedbackCharts = ({ feedbackData }) => {
  const [selectedCategory, setSelectedCategory] = useState('usability');
  const [chartType, setChartType] = useState('bar');
  const [timeFrame, setTimeFrame] = useState('all');
  const [processedData, setProcessedData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const chartRef = useRef(null);

  const categories = [
    { name: 'usability', icon: <FaUser /> },
    { name: 'navigation', icon: <FaSort /> },
    { name: 'design', icon: <FaPalette /> },
    { name: 'questionQuality', icon: <FaQuestion /> },
    { name: 'answerQuality', icon: <FaComments /> },
    { name: 'searchFunctionality', icon: <FaSearch /> },
    { name: 'sortingOptions', icon: <FaSort /> },
    { name: 'companyTagging', icon: <FaUser /> },
    { name: 'lightMode', icon: <FaSun /> },
    { name: 'darkMode', icon: <FaMoon /> },
  ];

  const timeFrames = ['all', 'week', 'month', 'year', 'custom'];
  const chartTypes = ['bar', 'line', 'area', 'radar', 'scatter'];

  useEffect(() => {
    if (feedbackData) {
      const filteredData = filterDataByTimeFrame(feedbackData);
      const data = processData(filteredData);
      setProcessedData(data);
    }
  }, [feedbackData, selectedCategory, timeFrame, startDate, endDate]);

  useEffect(() => {
    updateDateRange();
  }, [timeFrame]);

  const updateDateRange = () => {
    const now = new Date();
    let start, end;

    switch (timeFrame) {
      case 'week':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        end = now;
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = now;
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        end = now;
        break;
      case 'custom':
        // Don't change the custom date range
        return;
      default:
        start = new Date(0); // Beginning of time
        end = now;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };



  const handleTimeFrameChange = (e) => {
    setTimeFrame(e.target.value);
    if (e.target.value !== 'custom') {
      updateDateRange();
    }
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setTimeFrame('custom');
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setTimeFrame('custom');
  };

  const filterDataByTimeFrame = (data) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set to end of day

    return data.filter(item => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= start && itemDate <= end;
    });
  };

  const processData = (data) => {
    return [1, 2, 3, 4, 5].map(rating => ({
      name: `${rating} Star${rating > 1 ? 's' : ''}`,
      value: data.filter(item => item[selectedCategory] === rating).length
    }));
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#6c63ff" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#6c63ff" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="value" stroke="#6c63ff" fill="#6c63ff" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={processedData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar name={selectedCategory} dataKey="value" stroke="#6c63ff" fill="#6c63ff" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        );
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis dataKey="name" type="category" />
              <YAxis dataKey="value" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name={selectedCategory} data={processedData} fill="#6c63ff" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const exportToPNG = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'feedback_chart.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  return (
    <div className="Analysis-feedback-charts">
      <h1 className="Analysis-title">Feedback Analysis</h1>
      <div className="Analysis-chart-controls">
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map(category => (
            <option key={category.name} value={category.name}>
              {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
            </option>
          ))}
        </select>
        <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
          {chartTypes.map(type => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)} Chart</option>
          ))}
        </select>
        <select value={timeFrame} onChange={handleTimeFrameChange}>
          {timeFrames.map(frame => (
            <option key={frame} value={frame}>
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="Analysis-date-range">
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
        />
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
        />
      </div>
      <div className="Analysis-chart-container" ref={chartRef}>
        {renderChart()}
      </div>
      <button className="Analysis-export-button" onClick={exportToPNG}>
        <FaDownload /> Export to PNG
      </button>
    </div>
  );
};

export default FeedbackCharts;