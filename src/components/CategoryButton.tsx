interface CategoryButtonProps {
  categoryName: string;
  onClick: () => void;
  isSelected?: boolean; 
  isRandom?: boolean;
}

export default function CategoryButton({ categoryName, onClick, isSelected, isRandom }: CategoryButtonProps) {
  // Budujemy ciąg klas na podstawie propsów
  let className = "btn btn-category";
  if (isSelected) className += " selected";
  if (isRandom) className += " category-random";

  return (
    <button className={className} onClick={onClick}>
      {categoryName}
    </button>
  );
}