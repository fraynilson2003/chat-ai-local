"use client";

import {
  ChatCompletionMessageParam,
  CreateWebWorkerMLCEngine,
  InitProgressCallback,
  MLCEngineInterface,
  ModelRecord,
  prebuiltAppConfig,
} from "@mlc-ai/web-llm";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { Select, SelectItem } from "@nextui-org/select";

import MessagesAI from "./MessagesAI";
import { subtitle } from "./primitives";
import { Mode } from "fs";

interface ModelSelect extends Partial<ModelRecord> {
  model: string;
  model_id: string;
  vram_required_MB?: number;
}

export default function ChatLocal() {
  const [progress, setProgress] = useState<string>("Esperando...");
  const [engine, setEngine] = useState<MLCEngineInterface | undefined>(
    undefined
  );
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<ChatCompletionMessageParam>>([
    { role: "system", content: "tu eres un chatbot y hablas en español" },
    {
      role: "assistant",
      content: "hola, dime que necesitas para poder ayudarte",
    },
  ]);
  const [valueInput, setValueInput] = useState<string>("");

  const models = prebuiltAppConfig.model_list;
  const KEY_MODEL_LOCALSTORAGE = "modelAI";

  const [selectModel, setSelectModel] = useState<ModelSelect>({
    model: "https://huggingface.co/mlc-ai/Llama-3.2-1B-Instruct-q4f16_1-MLC",
    model_id: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
    vram_required_MB: 879.04,
  });

  const changeModel = (modelId: ModelSelect["model_id"]) => {
    const findModel = models.find((model) => model.model_id === modelId);

    if (findModel) {
      setSelectModel(findModel);
    }

    localStorage.setItem(KEY_MODEL_LOCALSTORAGE, modelId);
    createEngine(modelId);
  };

  const handlerResetChat = () => {
    setMessages([
      { role: "system", content: "tu eres un chatbot y hablas en español" },
      {
        role: "assistant",
        content: "hola, dime que necesitas para poder ayudarte",
      },
    ]);
    setValueInput("");
    setIsSubmiting(false);
  };

  const setResponseProgresiveMessageAI = (
    response: string,
    updatedMessages: ChatCompletionMessageParam[]
  ) => {
    const lastMessage = updatedMessages[updatedMessages.length - 1];

    if (lastMessage.role === "assistant") {
      updatedMessages[updatedMessages.length - 1] = {
        role: "assistant",
        content: response,
      };
      setMessages(updatedMessages);
    } else {
      updatedMessages.push({ role: "assistant", content: response });
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: response },
      ]);
    }
  };

  const sendMessageUser = async (message: string) => {
    const newMessages: ChatCompletionMessageParam[] = [
      ...messages,
      { role: "user", content: message },
    ];

    sendMessageEngine(newMessages);
  };

  const sendMessageEngine = async (
    updatedMessages: ChatCompletionMessageParam[]
  ) => {
    if (engine) {
      setIsSubmiting(true);
      const chunks = await engine.chat.completions.create({
        messages: updatedMessages,
        temperature: 1,
        stream: true,
        stream_options: { include_usage: true },
      });

      // Stream
      let reply = "";

      for await (const chunk of chunks) {
        reply += chunk.choices[0]?.delta.content || "";
        setResponseProgresiveMessageAI(reply, updatedMessages);
      }

      setIsSubmiting(false);
      setValueInput("");
    }
  };

  const createEngine = async (modelId: string) => {
    setEngine(undefined);
    const initProgressCallback: InitProgressCallback = (initProgress) => {
      setProgress(initProgress.text);
    };

    const create = await CreateWebWorkerMLCEngine(
      new Worker("/worker.js", {
        type: "module",
      }),
      modelId,
      { initProgressCallback } // engineConfig
    );

    setEngine(create);
  };

  useEffect(() => {
    const defaultModelStorage = localStorage.getItem(KEY_MODEL_LOCALSTORAGE);
    let modelDefault: ModelSelect | undefined = undefined;

    if (defaultModelStorage) {
      modelDefault = models.find(
        (model) => model.model_id === defaultModelStorage
      );
      setSelectModel(modelDefault!);
    } else {
      const model: ModelSelect = {
        model:
          "https://huggingface.co/mlc-ai/Llama-3.2-1B-Instruct-q4f16_1-MLC",
        model_id: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
        vram_required_MB: 879.04,
      };

      modelDefault = model;
      setSelectModel(model);
    }

    const handler = async () => {
      await createEngine(modelDefault!.model_id);
    };

    handler();
  }, []);

  return (
    <div className="flex flex-1 flex-col w-full gap-4">
      <div className=" flex justify-start items-center h-8 gap-4  mt-6 lg:justify-end">
        <Button
          aria-label="Reiniciar chat"
          className="px-2"
          radius="sm"
          size="sm"
          onPress={() => handlerResetChat()}
        >
          Reiniciar chat
        </Button>
        <Select
          aria-label="Selecciona un modelo de IA"
          className="flex-1 lg:max-w-xs"
          placeholder="Selecciona el modelo"
          selectedKeys={[selectModel.model_id]}
          size="sm"
          onChange={(e) => changeModel(String(e.target.value).trim())}
        >
          {models.map((model, i) => (
            <SelectItem key={model.model_id} value={model.model_id}>
              {model.model_id}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* caja de texto */}
      <div className="flex flex-col min-h-48 h-auto w-full min-w-ful py-4 gap-5  max-w-5xl mx-auto  border-2 border-gray-800 lg:gap-6 lg:py-6">
        {engine === undefined && (
          <div className="w-full flex-1 h-full flex flex-col justify-center items-center">
            <Spinner size="lg" />
            <span className={`${subtitle()} text-center`}>Cargando modelo</span>
          </div>
        )}
        {engine &&
          messages.map((ele, i) => <MessagesAI key={i} message={ele} />)}
      </div>

      {/* input */}
      <div className="flex l gap-2 justify-between items-center ">
        <Input
          isRequired
          isDisabled={isSubmiting}
          placeholder="Escribe aquí tu mensaje"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === "Enter") {
              if (valueInput.length > 0) {
                sendMessageUser(valueInput);
                setValueInput("");
              }
            }
          }}
        />
        <Button
          isDisabled={isSubmiting || !engine || !valueInput}
          radius="full"
          onPress={() => sendMessageUser(valueInput)}
        >
          Enviar
        </Button>
      </div>

      <div>{progress}</div>
    </div>
  );
}
