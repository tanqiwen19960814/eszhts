import CommandEnum from "./CommandEnum";

export default function(cmd, roleFrom, roleTo, params) {
  if (!cmd || !CommandEnum.hasOwnProperty(cmd)) {
    throw new Error("非法的websocket命令");
  }
  this.cmd = CommandEnum[cmd];
  this.roleFrom = roleFrom;
  this.roleTo = roleTo;
  this.params = params;
}
