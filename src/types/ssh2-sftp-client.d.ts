declare module "ssh2-sftp-client" {
  type FileInfo = {
    type: string;
    name: string;
    size?: number;
    modifyTime?: number;
    accessTime?: number;
    rights?: unknown;
    owner?: unknown;
    group?: unknown;
  };

  type ConnectOptions = {
    host: string;
    port?: number;
    username: string;
    password?: string;
    readyTimeout?: number;
  };

  export default class SftpClient {
    connect(options: ConnectOptions): Promise<void>;
    end(): Promise<void>;
    list(path: string): Promise<FileInfo[]>;
    get(path: string): Promise<Buffer | Uint8Array | string>;
  }
}

