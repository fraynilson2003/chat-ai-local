"use client";

import { ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  message: ChatCompletionMessageParam;
}

export default function MessagesAI({ message }: Props) {
  if (message.role != "user" && message.role != "assistant") return <></>;

  const isAssistant = message.role === "assistant";

  return (
    <div className="w-full">
      <div
        className={`flex-1 px-3 py-2 text-base text-start rounded text-black overflow-hidden dark:text-white lg:py-4 ${isAssistant ? "mr-6 ml-2  lg:mr-20 lg:ml-4 " : " ml-10 mr-2 lg:ml-20 lg:mr-4 bg-slate-100 dark:bg-emerald-100/75 "}`}
      >
        {isAssistant ? (
          <ReactMarkdown
            components={{
              //@ts-ignore
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");

                // Renderizado de bloques de código con resaltado
                if (!inline && match) {
                  return (
                    <SyntaxHighlighter
                      PreTag="div"
                      language={match[1]}
                      //@ts-ignore
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      style={materialDark}
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  );
                }

                // Renderizado de código en línea
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {String(message.content) || ""}
          </ReactMarkdown>
        ) : (
          <> {String(message.content) || ""}</>
        )}
      </div>
    </div>
  );
}
{
}
