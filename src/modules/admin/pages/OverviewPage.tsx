import { Users, MessageSquare, Heart, TrendingUp } from 'lucide-react';
import { StatItem } from '@/lib/types/interfaces';
import StatCard from '../components/StatCard';

import RecentUsers from '../components/Overview/RecentUsers';
import RecentPosts from '../components/Overview/RecentPosts';

export default function OverviewPage() {
  const stats: StatItem[] = [
    {
      title: 'Total Users',
      value: '12,345',
      change: '+12%',
      trend: 'up',
      icon: Users,
      description: 'Active users this month',
    },
    {
      title: 'Total Posts',
      value: '8,967',
      change: '+8%',
      trend: 'up',
      icon: MessageSquare,
      description: 'Posts created this month',
    },
    {
      title: 'Engagement',
      value: '156,789',
      change: '+23%',
      trend: 'up',
      icon: Heart,
      description: 'Total likes and comments',
    },
    {
      title: 'Growth Rate',
      value: '15.2%',
      change: '-2%',
      trend: 'down',
      icon: TrendingUp,
      description: 'User growth this month',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div>
        <h1 className='text-3xl font-bold text-foreground'>Dashboard Overview</h1>
        <p className='text-muted-foreground'>Monitor your social media platform's performance</p>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat, index) => (
          <StatCard stat={stat} key={new Date().getTime() + index} />
        ))}
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Recent Users */}
        <RecentUsers />

        {/* Recent Posts */}
        <RecentPosts />
      </div>
    </div>
  );
}
