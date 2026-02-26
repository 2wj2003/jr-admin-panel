/* eslint-disable @next/next/no-img-element */
import cx from "classnames";
// import { HTMLReactParserOptions } from "html-react-parser";
// import { Element } from "domhandler/lib/node";
import parse from "html-react-parser";
import Image from "next/image";

// const options: HTMLReactParserOptions = {
//   replace: (domNode) => {
//     if (domNode instanceof Element && domNode.name === 'img') {
//       const { style, srcset, alt, src, ...attribs } = domNode.attribs;

//       return <Image src={src} alt={alt} loading="lazy" />;
//     }
//     if (domNode instanceof Element && domNode.name === 'iframe') {
//       const { style, allowfullscreen, frameborder, ...attribs } =
//         domNode.attribs;

//       return (
//         <iframe
//           {...attribs}
//           allowFullScreen={allowfullscreen === 'true'}
//           frameBorder={frameborder}
//           loading="lazy"
//           className="top-0 left-0 w-full h-full absolute"
//         />
//       );
//     }
//   }
// };

export interface RichTextProps {
  markup: string;
  className?: string;
}
export const RichText: React.FC<RichTextProps> = ({ markup, className }) => {
  return (
    <div
      className={cx(
        "w-full text-gray-secondary whitespace-pre-wrap max-w-full",
        className || "prose prose-lg"
      )}
    >
      {parse(markup)}
    </div>
  );
};

export default RichText;
