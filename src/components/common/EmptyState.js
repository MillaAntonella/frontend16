'use client';
import Button from './Button';

export default function EmptyState({ 
  icon = '📭', 
  title = 'No hay elementos', 
  message = 'Aún no hay nada aquí',
  action,
  actionLabel
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">{message}</p>
      {action && actionLabel && (
        <Button onClick={action}>{actionLabel}</Button>
      )}
    </div>
  );
}
