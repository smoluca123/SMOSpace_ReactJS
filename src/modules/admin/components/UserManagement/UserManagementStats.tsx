import { StatItem } from '@/lib/types/interfaces';
import { Users, Activity, Shield, Ban } from 'lucide-react';
import StatCard from '../StatCard';
import { useGetUserCountQuery } from '../querys';

const UserManagementStats = () => {
  const { data: userCountData } = useGetUserCountQuery();

  if (!userCountData) return null;

  const USER_STATS: StatItem[] = [
    {
      title: 'Total Users',
      value: userCountData?.totalUser.toString(),
      icon: Users,
      trend: 'up',
      change: '+12.5%',
      description: 'Total registered users',
    },
    {
      title: 'Active Users',
      value: userCountData.totalUserActive.toString(),
      icon: Activity,
      trend: 'up',
      change: '+8.2%',
      description: 'Users who are active',
    },
    {
      title: 'Admin',
      value: userCountData.totalAdmin.toString(),
      icon: Shield,
      trend: 'down',
      change: '-2.1%',
      description: 'Users who are inactive',
    },
    {
      title: 'Banned Users',
      value: userCountData.totalUserBanned.toString(),
      icon: Ban,
      trend: 'down',
      change: '-0.5%',
      description: 'Users who are banned',
    },
  ];

  return (
    <div className='grid gap-4 md:grid-cols-4'>
      {USER_STATS.map((stat) => (
        <StatCard stat={stat} key={stat.title} />
      ))}
    </div>
  );
};

export default UserManagementStats;
