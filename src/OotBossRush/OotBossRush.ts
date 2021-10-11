import { IModLoaderAPI } from 'modloader64_api/IModLoaderAPI';
import { SidedProxy, ProxySide } from 'modloader64_api/SidedProxy/SidedProxy';
import { OotBossRushClient } from './OotBossRushClient';

class OotBossRush {

    ModLoader!: IModLoaderAPI;
    pluginName?: string | undefined;
    @SidedProxy(ProxySide.CLIENT, OotBossRushClient)
    client!: OotBossRushClient;
    
}

module.exports = OotBossRush;