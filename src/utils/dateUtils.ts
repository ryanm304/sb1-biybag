import { format, formatDistanceToNow, addDays } from 'date-fns';

export const formatDate = (date: string | Date) => {
  return format(new Date(date), 'MMM d, yyyy');
};

export const getTimeAgo = (date: string | Date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

export const getDueDate = () => {
  const dueDate = addDays(new Date(), 7); // 1 week from now
  return dueDate.toISOString();
};