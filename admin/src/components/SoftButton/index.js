import { forwardRef } from "react";
import PropTypes from "prop-types";
import SoftButtonRoot from "./SoftButtonRoot";
import { useSoftUIController } from "context";

const SoftButton = forwardRef(
  ({ color, variant, size, circular, iconOnly, children, ...rest }, ref) => {
    const [controller] = useSoftUIController();
    const { buttonColor } = controller;

    return (
      <SoftButtonRoot
        {...rest}
        ref={ref}
        color={color || buttonColor}
        variant={variant === "gradient" ? "contained" : variant}
        size={size}
        ownerState={{ color:  buttonColor, variant, size, circular, iconOnly }}
      >
        {children}
      </SoftButtonRoot>
    );
  }
);

SoftButton.defaultProps = {
  size: "medium",
  variant: "contained",
  color: "white",
  circular: false,
  iconOnly: false,
};

SoftButton.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["text", "contained", "outlined", "gradient"]),
  color: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  circular: PropTypes.bool,
  iconOnly: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default SoftButton;
