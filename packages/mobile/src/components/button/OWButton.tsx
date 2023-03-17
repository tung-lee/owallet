import {
  View,
  Text,
  TouchableOpacityProps,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle
} from 'react-native';
import React, { FunctionComponent } from 'react';
import { useMapStyles } from './hooks';
import { LoadingSpinner } from '../spinner';
import { useTheme } from '@src/themes/theme-provider';

interface IOWButtonProps extends TouchableOpacityProps {
  type?: 'primary' | 'secondary' | 'link' | 'modal';
  size?: 'medium' | 'small' | 'large';
  label?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  circle?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const OWButton: FunctionComponent<IOWButtonProps> = ({
  label,
  type = 'primary',
  size = 'large',
  style,
  textStyle,
  disabled,
  icon,
  fullWidth,
  loading,
  ...props
}) => {
  const styleMapped = useMapStyles({ type, disabled, size });
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      style={[
        styles.containerBtn,
        styleMapped.btn,
        fullWidth && styles.fullWidth,
        !!icon && !label && styles.hasIcon,
        style
      ]}
    >
      {loading ? (
        <LoadingSpinner color={colors['white']} size={20} />
      ) : (
        <>
          {!!icon && icon}
          {!!label && (
            <Text style={[styles.textBtn, styleMapped.text, textStyle]}>
              {label}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default OWButton;
const styles = StyleSheet.create({
  hasIcon: { height: 'auto' },
  fullWidth: { width: '100%' },
  containerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12
  },
  textBtn: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16
  }
});
