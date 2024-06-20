import Select, { GroupBase, StylesConfig } from 'react-select';
import styles from '@/styles/components/select.module.css';

interface LabelOption {
  label: string;
  value: number;
}

interface SelectProps {
  id: string;
  values: LabelOption[];
  value?: LabelOption;
  errorText?: string;
  required?: boolean;
  label: string;
  placeholder: string;
  customUserInput?: boolean;
  isLoading: boolean;
  handleChange: (newValue?: number) => void;
}

export default function SelectComponent({
  id,
  values,
  value,
  errorText,
  required = false,
  label,
  placeholder,
  customUserInput = true,
  isLoading,
  handleChange
}: SelectProps) {
  const colourStyles: StylesConfig<LabelOption, false, GroupBase<LabelOption>> = {
    control: (base) => ({
      ...base,
      borderColor: errorText ? '#fb0938' : '#afafaf',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid #afafaf'
      }
    }),
    option: (styles, { isFocused }) => ({
      border: 0,
      ...styles,
      backgroundColor: isFocused ? '#dedede' : '',
      color: '#333333'
    }),
    menu: (provided) => ({ ...provided, zIndex: 5 })
  };

  return (
    <div id={id} className={styles.selectContainer}>
      <label className={styles.label}>
        {label}
        {required && <span>*</span>}
      </label>
      <Select
        styles={colourStyles}
        options={values}
        defaultValue={value}
        placeholder={placeholder}
        isLoading={isLoading}
        isSearchable={customUserInput}
        onChange={(e) => handleChange(e?.value)}
      />
      {errorText && <span className={styles.errorText}>{errorText}</span>}
    </div>
  );
}
