import React, {
  memo, useState, useRef, FocusEvent, FormEvent, ChangeEvent,
} from 'react';
import DropdownMenu from './DropdownMenu';
import onBlurMenu from './helpers/blurMenu.helper';
import getOptions from './helpers/getOptions.helper';
import useMenuListener from './hooks/useMenuListener';
import DropdownSelected from './DropdownSelected';
import DropdownTrigger from './DropdownInput';
import styles from './Dropdown.module.scss';
import DropdownButton from './DropdownButton';

interface DropdownProps {
  name?: string;
  options: string[];
  onSelect?: (a: string) => void;
  selected?: string[];
  placeholder?: string;
  label?: string;
  isMultiple?: boolean;
  onSearch?: (event: FormEvent<HTMLInputElement>) => void;
  searchValue?: string;
  mode?: 'plain' | 'default'
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  isMultiple = false,
  onSelect,
  name,
  label,
  placeholder,
  selected,
  onSearch,
  searchValue,
  mode = 'default',
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useMenuListener({
    refs: [menuRef, inputRef, buttonRef, selectedRef],
    setIsOpen,
    isOpen,
  });

  const getValue = (): string => {
    if (onSearch) {
      return searchValue || localSearchValue;
    }

    if (!isMultiple && selected?.length) {
      return selected[0];
    }

    return '';
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    onBlurMenu({ target: event.relatedTarget, refs: [menuRef, selectedRef], setIsOpen });
  };

  const handleButtonBlur = (event: FocusEvent<HTMLButtonElement>) => {
    onBlurMenu({ target: event.relatedTarget, refs: [menuRef, selectedRef], setIsOpen });
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setLocalSearchValue(event.target.value);
  };

  const modifiedOptions = getOptions({ searchValue: searchValue || localSearchValue, options });

  return (
    <div className={styles.root}>
      {mode === 'default'
        ? (
          <DropdownTrigger
            readOnly={!onSearch}
            name={name || ''}
            onChange={handleSearch}
            label={label}
            ref={inputRef}
            placeholder={placeholder}
            value={getValue()}
            onFocus={handleFocus}
            onBlur={handleInputBlur}
            isOpen={isOpen}
          />
        ) : (
          <DropdownButton
            name={name || ''}
            ref={buttonRef}
            label={label}
            placeholder={placeholder}
            value={getValue()}
            onFocus={handleFocus}
            onBlur={handleButtonBlur}
            isOpen={isOpen}
          />
        )}
      {isMultiple && selected?.length && (
        <div className={styles.row} ref={selectedRef}>
          <DropdownSelected unselect={onSelect} selected={selected = ['One', 'Two']} />
        </div>
      )}
      <DropdownMenu
        isOpen={isOpen}
        ref={menuRef}
        onSelect={onSelect}
        isMultiple={isMultiple}
        options={modifiedOptions}
        setIsOpen={setIsOpen}
        selected={selected}
      />
    </div>
  );
};

export default memo(Dropdown);
