import React from "react";

interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  className?: string;
}

// Generic component: works with a list of ANY type T
function List<T>({ items, renderItem, keyExtractor, emptyMessage, className }: ListProps<T>) {
  if (items.length === 0) {
    return <p className="empty-state">{emptyMessage ?? "Nothing to show."}</p>;
  }

  return (
    <div className={className ?? "list"}>
      {items.map((item) => (
        <div key={keyExtractor(item)}>{renderItem(item)}</div>
      ))}
    </div>
  );
}

export default List;
