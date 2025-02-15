import React from "react";
import { Button, Dropdown, Tooltip } from "neetoui";
import classnames from "classnames";
import { useHistory, useLocation } from "react-router-dom";

import SubMenu from "./SubMenu";

export default function NavItem({
  icon,
  link,
  title,
  subLinks,
  onClick,
  className,
}) {
  const history = useHistory();
  const location = useLocation();
  const isActive = link === location.pathname;

  const NavButton = () => (
    <Button
      style="icon"
      icon={icon}
      onClick={() => (onClick ? onClick() : history.push(link))}
      className={classnames(
        [
          "w-12 h-12 rounded-md text-2xl flex items-center justify-center opacity-100",
          className,
        ],
        {
          "bg-gray-200": isActive,
          "text-cool-gray-600  hover:bg-cool-gray-300  hover:text-cool-gray-600 ": !isActive,
        }
      )}
    />
  );

  if (subLinks) {
    return (
      <Dropdown
        position="right-top"
        interactionKind="hover"
        customTarget={() => <NavButton />}
        closeOnSelect
      >
        <SubMenu subLinks={subLinks} title={title} />
      </Dropdown>
    );
  } else {
    return (
      <div className="mb-6">
        <Tooltip content={title} position="right">
          <NavButton />
        </Tooltip>
      </div>
    );
  }
}
