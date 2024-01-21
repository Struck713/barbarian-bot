
namespace MinecraftServer {

    export interface Status {
        previewsChat: boolean;
        enforcesSecureChat: boolean;
        preventsChatReports: boolean;
        description: {
            text: string;
        };
        players: {
            max: number;
            online: number;
        };
        version: {
            name: string;
            protocol: number;
        }
        favicon: string;
    }

    export const ping = async (host: string, port: number = 25565, timeout: number = 3000, protocolVersion: number = 47): Promise<Status> => 
        new Promise((resolve, reject) => new (require('mcping-js'))
            .MinecraftServer(host, port).ping(timeout, protocolVersion, (err: any, res: any) => res ? resolve(res) : reject(err)));
}