interface CategoryButtonProps {
  categoryName: string;
  onClick: () => void;
  isSelected?: boolean;
  isRandom?: boolean; // Zostawione dla pełnej kompatybilności z Twoim kodem
  iconSrc?: string;   // Dodane dla nowych ikon
}

export default function CategoryButton({ categoryName, onClick, isSelected, isRandom, iconSrc }: CategoryButtonProps) {
  // 1. ZARZĄDZANIE KLASAMI CSS
  let className = "lavender-square-btn";
  if (isSelected) className += " selected";
  if (isRandom) className += " category-random";

  return (
    <button className={className} onClick={onClick}>
      {iconSrc && <img src={iconSrc} alt={categoryName} className="category-icon-img" />}
      <span className="category-label">{categoryName}</span>
    </button>
  );
}