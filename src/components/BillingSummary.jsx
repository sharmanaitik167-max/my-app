import { useMemo } from 'react';
import { IndianRupee, TrendingUp, Users, Calendar } from 'lucide-react';
import { isToday, isThisMonth } from 'date-fns';

export default function BillingSummary({ customers }) {
  const summary = useMemo(() => {
    let total = 0;
    let today = 0;
    let monthly = 0;
    let todayCustomers = 0;

    customers.forEach(c => {
      const amount = Number(c.amount) || 0;
      total += amount;

      const date = new Date(c.date);
      if (isToday(date)) {
        today += amount;
        todayCustomers++;
      }
      if (isThisMonth(date)) {
        monthly += amount;
      }
    });

    return { total, today, monthly, todayCustomers, totalCustomers: customers.length };
  }, [customers]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const cards = [
    {
      label: "Today's Sales",
      value: formatCurrency(summary.today),
      icon: <TrendingUp size={24} />,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      accent: 'border-l-orange-500'
    },
    {
      label: 'Total Customers',
      value: summary.totalCustomers,
      subtitle: `${summary.todayCustomers} today`,
      icon: <Users size={24} />,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      accent: 'border-l-blue-500'
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(summary.total),
      icon: <IndianRupee size={24} />,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      accent: 'border-l-green-500'
    },
    {
      label: 'Monthly Sales',
      value: formatCurrency(summary.monthly),
      icon: <Calendar size={24} />,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      accent: 'border-l-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`animate-fade-in-up stagger-${i + 1} bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 ${card.accent} flex items-center gap-4 hover:shadow-md transition-shadow`}
        >
          <div className={`p-3 rounded-xl ${card.iconBg} ${card.iconColor}`}>
            {card.icon}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{card.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-0.5">{card.value}</p>
            {card.subtitle && <p className="text-xs text-gray-400 mt-0.5">{card.subtitle}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
