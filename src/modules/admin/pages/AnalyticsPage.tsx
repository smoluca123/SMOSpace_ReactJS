import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, Users, Activity, BarChart3, Eye } from 'lucide-react';

export default function AnalyticsPage() {
  // Mock data for charts
  const userGrowthData = [
    { month: 'Jan', users: 1200, newUsers: 120 },
    { month: 'Feb', users: 1450, newUsers: 250 },
    { month: 'Mar', users: 1680, newUsers: 230 },
    { month: 'Apr', users: 2100, newUsers: 420 },
    { month: 'May', users: 2450, newUsers: 350 },
    { month: 'Jun', users: 2890, newUsers: 440 },
  ];

  const engagementData = [
    { day: 'Mon', posts: 45, likes: 1200, comments: 340, shares: 120 },
    { day: 'Tue', posts: 52, likes: 1450, comments: 420, shares: 150 },
    { day: 'Wed', posts: 48, likes: 1680, comments: 380, shares: 140 },
    { day: 'Thu', posts: 61, likes: 2100, comments: 520, shares: 180 },
    { day: 'Fri', posts: 58, likes: 1950, comments: 480, shares: 170 },
    { day: 'Sat', posts: 67, likes: 2300, comments: 580, shares: 200 },
    { day: 'Sun', posts: 43, likes: 1800, comments: 350, shares: 130 },
  ];

  const deviceData = [
    { name: 'Mobile', value: 65, color: '#3b82f6' },
    { name: 'Desktop', value: 25, color: '#10b981' },
    { name: 'Tablet', value: 10, color: '#f59e0b' },
  ];

  const topContentData = [
    { category: 'Lifestyle', posts: 245, engagement: 85 },
    { category: 'Technology', posts: 189, engagement: 92 },
    { category: 'Business', posts: 156, engagement: 78 },
    { category: 'Creative', posts: 134, engagement: 88 },
    { category: 'Opinion', posts: 98, engagement: 95 },
  ];

  const stats = [
    {
      title: 'Total Views',
      value: '2.4M',
      change: '+12.5%',
      icon: Eye,
      description: 'Page views this month',
    },
    {
      title: 'Engagement Rate',
      value: '24.5%',
      change: '+8.2%',
      icon: Activity,
      description: 'Average engagement rate',
    },
    {
      title: 'Total Posts',
      value: '8,967',
      change: '+15.3%',
      icon: BarChart3,
      description: 'Posts created this month',
    },
    {
      title: 'Active Users',
      value: '12.3K',
      change: '+2.1%',
      icon: Users,
      description: 'Monthly active users',
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='p-3 border rounded-lg shadow-sm bg-card border-border'>
          <p className='font-medium text-foreground'>{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className='text-sm'>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div>
        <h1 className='text-3xl font-bold text-foreground'>Analytics Dashboard</h1>
        <p className='text-muted-foreground'>Comprehensive platform analytics and insights</p>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat, index) => (
          <Card key={index} className='transition-shadow hover:shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                {stat.title}
              </CardTitle>
              <stat.icon className='w-4 h-4 text-primary' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-foreground'>{stat.value}</div>
              <div className='flex items-center mt-1 text-xs text-muted-foreground'>
                <TrendingUp className='w-3 h-3 mr-1 text-green-500' />
                <span className='text-green-500'>{stat.change}</span>
                <span className='ml-1'>from last month</span>
              </div>
              <p className='mt-1 text-xs text-muted-foreground'>{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user acquisition trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                <XAxis dataKey='month' className='text-muted-foreground' fontSize={12} />
                <YAxis className='text-muted-foreground' fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type='monotone'
                  dataKey='users'
                  stroke='#3b82f6'
                  fill='#3b82f6'
                  fillOpacity={0.1}
                />
                <Area
                  type='monotone'
                  dataKey='newUsers'
                  stroke='#10b981'
                  fill='#10b981'
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
            <CardDescription>Platform access by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey='value'
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className='flex justify-center mt-4 space-x-6'>
              {deviceData.map((item, index) => (
                <div key={index} className='flex items-center space-x-2'>
                  <div className='w-3 h-3 rounded-full' style={{ backgroundColor: item.color }} />
                  <span className='text-sm text-muted-foreground'>
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Engagement */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Engagement</CardTitle>
          <CardDescription>Posts, likes, comments, and shares over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={400}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
              <XAxis dataKey='day' className='text-muted-foreground' fontSize={12} />
              <YAxis className='text-muted-foreground' fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line type='monotone' dataKey='posts' stroke='#3b82f6' strokeWidth={2} />
              <Line type='monotone' dataKey='likes' stroke='#10b981' strokeWidth={2} />
              <Line type='monotone' dataKey='comments' stroke='#f59e0b' strokeWidth={2} />
              <Line type='monotone' dataKey='shares' stroke='#ef4444' strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Content Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Top Content Categories</CardTitle>
          <CardDescription>Most popular content categories by engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={topContentData}>
              <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
              <XAxis dataKey='category' className='text-muted-foreground' fontSize={12} />
              <YAxis className='text-muted-foreground' fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey='posts' fill='#3b82f6' />
              <Bar dataKey='engagement' fill='#10b981' />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
