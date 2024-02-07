import React from "react";
import Markdown, { Options } from "react-markdown";

export const DescriptionMarkdown = ({
  children,
  ...props
}: Readonly<Options>) => {
  return (
    <Markdown
      {...props}
      components={{
        a(props) {
          const { node, ...rest } = props;
          return <a className="regular-link" target="_blank" {...rest} />;
        },
        p(props) {
          const { node, ...rest } = props;
          return <p className="text-small-regular" {...rest} />;
        },
      }}
    >
      {children}
    </Markdown>
  );
};
