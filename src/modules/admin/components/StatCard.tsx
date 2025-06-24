import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatItem } from '@/lib/types/interfaces';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function StatCard({ stat }: { stat: StatItem }) {
  return (
    <Card className='transition-shadow hover:shadow-md'>
      <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>{stat.title}</CardTitle>
        <stat.icon className='w-4 h-4 text-primary' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold text-foreground'>{stat.value}</div>
        <div className='flex items-center mt-1 text-xs text-muted-foreground'>
          {stat.trend === 'up' ? (
            <ArrowUpRight className='w-3 h-3 mr-1 text-green-500' />
          ) : (
            <ArrowDownRight className='w-3 h-3 mr-1 text-red-500' />
          )}
          <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
            {stat.change}
          </span>
          <span className='ml-1'>from last month</span>
        </div>
        <p className='mt-1 text-xs text-muted-foreground'>{stat.description}</p>
      </CardContent>
    </Card>
  );
}
