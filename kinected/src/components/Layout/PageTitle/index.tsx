import React from "react";

type Props = {
  children: string;
};
export const PageTitle = (props: Props) => {
  return <h1 className={"text-3xl font-bold"}>{props.children}</h1>;
};

export default PageTitle;
