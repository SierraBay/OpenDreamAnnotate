import fs from "fs";
import os from "os";
import * as core from "@actions/core"

export interface Match {
  type: "Error" | "Warning",
  path: string,
  code: string,
  line: string,
  column: string,
  message: string
}

try {
  const data = fs.readFileSync(core.getInput("outputFile")).toString("utf8");
  core.info("OpenDream compiler Output: ");
  core.info(data);
  const regex = new RegExp(/(?<type>(Error|Warning)) (?<code>.*) at (?<path>[^:]+):(?<line>\d+):(?<column>\d+): (?<message>.*)/, "g");

  const matches = Array.from(data.matchAll(regex), m => m.groups) as unknown as Match[];

  for(const match of matches)
    process.stdout.write(`::${match.type.toLowerCase()} file=${match.path},line=${match.line},col=${match.column}::${match.code} - ${match.message}${os.EOL}`);

} catch (error: any) { core.setFailed(error.message); }