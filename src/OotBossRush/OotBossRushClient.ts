import { onTick, Postinit } from 'modloader64_api/PluginLifecycle';
import { InjectCore } from 'modloader64_api/CoreInjection';
import { IModLoaderAPI } from 'modloader64_api/IModLoaderAPI';
import { ModLoaderAPIInject } from "modloader64_api/ModLoaderAPIInjector";
import { bus, EventHandler } from 'modloader64_api/EventHandler';
import { IZ64Main } from 'Z64Lib/API/Common/IZ64Main';
import { AmmoUpgrade, Magic, MagicQuantities, Ocarina, UpgradeCountLookup, Z64Events } from 'Z64Lib/API/Common/Z64API';
import { InventoryItem, Strength, ZoraScale, Hookshot } from 'Z64Lib/API/OoT/OOTAPI';

const enum Z64OnlineEvents {
    GHOST_MODE = 'Z64Online:EnableGhostMode'
}

function Z64O_OOT_EnableGhostMode() {
    bus.emit(Z64OnlineEvents.GHOST_MODE, {});
}

export class OotBossRushClient {

    @InjectCore()
    core!: IZ64Main;
    @ModLoaderAPIInject()
    ModLoader!: IModLoaderAPI;
    kits: Map<number, SceneKit> = new Map<number, SceneKit>();
    volvagia_fix: boolean = false;
    disableWarps: boolean = false;

    healPlayer() {
        if (
            this.core.OOT!.helper.isTitleScreen() ||
            !this.core.OOT!.helper.isSceneNumberValid()
        ) {
            return;
        }
        this.ModLoader.emulator.rdramWrite16(
            global.ModLoader.save_context + 0x1424,
            0x65
        );
    }

    @Postinit()
    onPostInit() {
        Z64O_OOT_EnableGhostMode();
        let link = 0x0034;
        this.kits.set(link, new SceneKit(link, () => {
            this.core.OOT!.save.boots.kokiriBoots = true;
            this.core.OOT!.save.tunics.kokiriTunic = true;
            this.core.OOT!.save.swords.kokiriSword = true;
        }));
        let gohma = 0x0011;
        this.kits.set(gohma, new SceneKit(gohma, () => {
            setInterval(() => {
                this.core.OOT!.save.questStatus.displayGoldSkulltulas = true;
                this.core.OOT!.save.questStatus.goldSkulltulas = this.core.OOT!.save.questStatus.goldSkulltulas + 1;
            }, 60 * 1000);
            // Equipment
            this.core.OOT!.save.shields.dekuShield = true;
            // Inventory
            // Bullet Bag
            this.core.OOT!.save.inventory.bulletBag = AmmoUpgrade.BASE;
            this.core.OOT!.save.inventory.fairySlingshot = true;
            this.core.OOT!.save.inventory.dekuSeeds = UpgradeCountLookup(InventoryItem.FAIRY_SLINGSHOT, this.core.OOT!.save.inventory.bulletBag);
            // Deku Nuts
            this.core.OOT!.save.inventory.dekuNutsCapacity = AmmoUpgrade.BASE;
            this.core.OOT!.save.inventory.dekuNutsCount = UpgradeCountLookup(InventoryItem.DEKU_NUT, this.core.OOT!.save.inventory.dekuNutsCapacity);
            this.core.OOT!.save.inventory.dekuNuts = true;
            // Deku Sticks.
            this.core.OOT!.save.inventory.dekuSticksCapacity = AmmoUpgrade.BASE;
            this.core.OOT!.save.inventory.dekuSticksCount = UpgradeCountLookup(InventoryItem.DEKU_STICK, this.core.OOT!.save.inventory.dekuSticksCapacity);
            this.core.OOT!.save.inventory.dekuSticks = true;
        }));
        let dodongo = 0x0012;
        this.kits.set(dodongo, new SceneKit(dodongo, () => {
            this.core.OOT!.save.inventory.ocarina = Ocarina.FAIRY_OCARINA;
            this.core.OOT!.save.questStatus.zeldasLullaby = true;
            this.core.OOT!.save.questStatus.eponasSong = true;
            this.core.OOT!.save.questStatus.sunsSong = true;
            this.core.OOT!.save.questStatus.sariasSong = true;
            this.core.OOT!.save.inventory.strength = Strength.GORON_BRACELET;
            this.core.OOT!.save.shields.hylianShield = true;
            this.core.OOT!.save.inventory.bombs = true;
            this.core.OOT!.save.inventory.bombBag = AmmoUpgrade.BASE;
            this.core.OOT!.save.inventory.bombsCount = UpgradeCountLookup(InventoryItem.BOMB, this.core.OOT!.save.inventory.bombBag);
            this.core.OOT!.save.inventory.bottle_1 = InventoryItem.BOTTLED_FAIRY;
            this.core.OOT!.save.inventory.childTradeItem = InventoryItem.ZELDAS_LETTER;
        }));
        let barinade = 0x0013;
        this.kits.set(barinade, new SceneKit(barinade, () => {
            this.core.OOT!.save.inventory.boomerang = true;
            this.core.OOT!.save.inventory.swimming = ZoraScale.SILVER;
            this.core.OOT!.save.inventory.bottle_2 = InventoryItem.BOTTLED_FAIRY;
            this.core.OOT!.save.magic_meter_size = Magic.NORMAL;
            this.core.OOT!.save.magic_current = MagicQuantities.NORMAL;
        }));
        let tot = 0x0043;
        this.kits.set(tot, new SceneKit(tot, () => {
            if (this.core.OOT!.save.questStatus.goldSkulltulas <= 5) {
                this.core.OOT!.save.swords.biggoronSword = true;
            }
            this.core.OOT!.save.questStatus.songOfTime = true;
            this.core.OOT!.save.magic_meter_size = Magic.NORMAL;
            this.core.OOT!.save.magic_current = MagicQuantities.NORMAL;
            this.core.OOT!.save.inventory.bombsCount = UpgradeCountLookup(InventoryItem.BOMB, this.core.OOT!.save.inventory.bombBag);
        }));
        let phantom = 0x0014;
        this.kits.set(phantom, new SceneKit(phantom, () => {
            this.core.OOT!.save.swords.masterSword = true;
            this.core.OOT!.save.inventory.adultTradeItem = InventoryItem.POCKET_EGG;
            this.core.OOT!.save.inventory.bottle_3 = InventoryItem.BOTTLED_FAIRY;
            this.core.OOT!.save.inventory.fairyBow = true;
            this.core.OOT!.save.inventory.quiver = AmmoUpgrade.BASE;
            this.core.OOT!.save.inventory.arrows = UpgradeCountLookup(InventoryItem.FAIRY_BOW, this.core.OOT!.save.inventory.quiver);
            this.core.OOT!.save.inventory.hookshot = Hookshot.HOOKSHOT;
            this.core.OOT!.save.questStatus.minuetOfForest = true;
            this.core.OOT!.save.questStatus.songOfStorms = true;
        }));
        let volvagia = 0x0015;
        this.kits.set(volvagia, new SceneKit(phantom, () => {
            if (!this.volvagia_fix) {
                this.core.OOT!.commandBuffer.runWarp(0x0305, 0x0);
                this.volvagia_fix = true;
                return;
            }
            this.core.OOT!.save.inventory.megatonHammer = true;
            this.core.OOT!.save.questStatus.boleroOfFire = true;
            this.core.OOT!.save.tunics.goronTunic = true;
            this.core.OOT!.save.inventory.bombchus = true;
            setTimeout(() => {
                this.core.OOT!.save.inventory.bombchuCount = 20;
            }, 3 * 1000);
            this.core.OOT!.save.inventory.bottle_4 = InventoryItem.BOTTLED_FAIRY;
        }));
        let morpha = 0x0016;
        this.kits.set(morpha, new SceneKit(morpha, () => {
            this.core.OOT!.save.inventory.hookshot = Hookshot.LONGSHOT;
            this.core.OOT!.save.boots.ironBoots = true;
            this.core.OOT!.save.questStatus.serenadeOfWater = true;
            this.core.OOT!.save.tunics.zoraTunic = true;
        }));
        let bongo = 0x0018;
        this.kits.set(bongo, new SceneKit(bongo, () => {
            this.core.OOT!.save.questStatus.nocturneOfShadow = true;
            this.core.OOT!.save.boots.hoverBoots = true;
            this.core.OOT!.save.inventory.fireArrows = true;
            this.core.OOT!.save.inventory.iceArrows = true;
            this.core.OOT!.save.inventory.lensOfTruth = true;
        }));
        let twinrova = 0x0017;
        this.kits.set(twinrova, new SceneKit(twinrova, () => {
            this.core.OOT!.save.questStatus.requiemOfSpirit = true;
            this.core.OOT!.save.shields.mirrorShield = true;
            this.core.OOT!.save.inventory.strength = Strength.SILVER_GAUNTLETS;
        }));
        let ganondorf = 0x0019;
        this.kits.set(ganondorf, new SceneKit(ganondorf, () => {
            this.core.OOT!.save.inventory.strength = Strength.GOLDEN_GAUNTLETS;
            this.core.OOT!.save.inventory.lightArrows = true;
            this.disableWarps = true;
        }));
    }

    @onTick()
    onTick(frame: number) {
    }

    @EventHandler(Z64Events.ON_SCENE_CHANGE)
    onSceneChange(scene: number) {
        // Setup entrance table here.
        if (scene === 0x0034 || scene === 0x0043) {
            for (let i = 0; i < 4; i++) {
                // Link's House -> Gohma
                this.ModLoader.emulator.rdramWrite32(0x800FA4D4 + (i * 4), this.ModLoader.emulator.rdramRead32(0x800FACCC));
                // Gohma Blue Warp -> King Dodongo
                this.ModLoader.emulator.rdramWrite32(0x800FADEC + (i * 4), this.ModLoader.emulator.rdramRead32(0x80FACBC));
                // King Dodongo Blue Warp -> Barinade
                this.ModLoader.emulator.rdramWrite32(0x800FAE78 + (i * 4), this.ModLoader.emulator.rdramRead32(0x800FA894));
                // Barinade Blue Warp -> Temple of Time
                this.ModLoader.emulator.rdramWrite32(0x800FA0C8 + (i * 4), this.ModLoader.emulator.rdramRead32(0x800F9DDC));
                // Phantom Ganon Blue Warp -> Volvagia
                this.ModLoader.emulator.rdramWrite32(0x800FB430 + (i * 4), this.ModLoader.emulator.rdramRead32(0x800FA8A4));
                // Volvagia Blue Warp -> Morpha
                this.ModLoader.emulator.rdramWrite32(0x800FB220 + (i * 4), this.ModLoader.emulator.rdramRead32(0x800FACEC));
            }
            for (let i = 0; i < 2; i++) {
                // Temple of Time (Child) -> Temple of Time
                this.ModLoader.emulator.rdramWrite32(0x800FA254 + (i * 4), this.ModLoader.emulator.rdramRead32(0x800F9DDC));
                // Temple of Time (Adult) -> Phantom Ganon
                this.ModLoader.emulator.rdramWrite32(0x800FAE60 + (i * 4), this.ModLoader.emulator.rdramRead32(0x800F9CC0));
            }
        }
        if (!this.disableWarps) {
            // Morpha Blue Warp -> Bongo
            if (scene === 0x0057) {
                this.core.OOT!.commandBuffer.runWarp(0x0413, 0x0);
                return;
            }
            // Bongo Blue Warp -> Twinrova
            if (scene === 0x0053) {
                this.core.OOT!.commandBuffer.runWarp(0x008D, 0x0);
                return;
            }
            // Twinrova Blue Warp -> Ganondorf
            if (scene === 0x005C) {
                this.core.OOT!.commandBuffer.runWarp(0x041F, 0x0);
                return;
            }
        }
        // Give out kits.
        if (this.kits.has(scene)) {
            let kit = this.kits.get(scene)!;
            kit.fn();
        }
    }
}

export class SceneKit {

    scene: number;
    fn: Function;

    constructor(scene: number, fn: Function) {
        this.scene = scene;
        this.fn = fn;
    }
}