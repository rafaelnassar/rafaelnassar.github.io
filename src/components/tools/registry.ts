import type { ComponentType } from "react";
import { PasswordChecker, PasswordGenerator } from "@/components/tools/PasswordTools";
import {
  DocumentGenerator,
  DocumentValidator,
  PersonGenerator,
} from "@/components/tools/DocumentTools";
import {
  CepGenerator,
  CreditCardGenerator,
  PhoneGenerator,
  VehicleGenerator,
} from "@/components/tools/GeneratorTools";
import { SorteadorContagemTool, SorteadorListaTool, SorteadorRoletaTool, SorteadorTool } from "@/components/tools/SorteadorTools";
import { RescisaoCalculator } from "@/components/tools/LaborTools";
import { FancyTextTool, NumberWordsTool } from "@/components/tools/TextTools";
import { CreditCardValidator } from "@/components/tools/ValidatorTools";
import {
  MetaTagsGenerator,
  MyBrowserTool,
  MyIpTool,
  MyOsTool,
  QrCodeGenerator,
} from "@/components/tools/WebTools";
import { SpeedTestTool } from "@/components/tools/SpeedTestTool";
import {
  CaseConverter,
  ColorConverter,
  JsonFormatter,
  JwtDecoder,
  LoremGenerator,
  TextCounter,
  UuidGenerator,
} from "@/components/tools/DevTools";

export const toolComponents: Record<string, ComponentType> = {
  "gerador-de-senha": PasswordGenerator,
  "verificador-de-senha": PasswordChecker,
  "gerador-cpf-cnpj": DocumentGenerator,
  "gerador-de-pessoa": PersonGenerator,
  "validador-cpf-cnpj": DocumentValidator,
  "validador-cartao-credito": CreditCardValidator,
  "gerador-cartao-credito": CreditCardGenerator,
  "gerador-veiculos": VehicleGenerator,
  "gerador-telefone": PhoneGenerator,
  "gerador-cep": CepGenerator,
  "gerador-de-uuid": UuidGenerator,
  sorteador: SorteadorTool,
  "sorteador-lista": SorteadorListaTool,
  "sorteador-roleta": SorteadorRoletaTool,
  "sorteador-contagem": SorteadorContagemTool,
  "gerador-meta-tags": MetaTagsGenerator,
  "gerador-qrcode": QrCodeGenerator,
  "formatador-json": JsonFormatter,
  "conversor-de-texto": CaseConverter,
  "contador-de-texto": TextCounter,
  lorem: LoremGenerator,
  "conversor-de-cor": ColorConverter,
  jwt: JwtDecoder,
  "rescisao-contrato": RescisaoCalculator,
  "textos-fontes-personalizadas": FancyTextTool,
  "numero-por-extenso": NumberWordsTool,
  "meu-ip": MyIpTool,
  "meu-navegador": MyBrowserTool,
  "meu-sistema-operacional": MyOsTool,
  "teste-de-velocidade": SpeedTestTool,
};
