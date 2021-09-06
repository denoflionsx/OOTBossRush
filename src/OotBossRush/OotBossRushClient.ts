import { onTick, Postinit } from 'modloader64_api/PluginLifecycle';
import { IOOTCore, OotEvents, InventoryItem, AmmoUpgrade, UpgradeCountLookup, Ocarina, Strength, ZoraScale, Hookshot, Magic, MagicQuantities } from 'modloader64_api/OOT/OOTAPI';
import { InjectCore } from 'modloader64_api/CoreInjection';
import { IModLoaderAPI } from 'modloader64_api/IModLoaderAPI';
import { ModLoaderAPIInject } from "modloader64_api/ModLoaderAPIInjector";
import { EventHandler } from 'modloader64_api/EventHandler';
import { OotOnlineAPI_EnableGhostMode } from './OotoAPI/OotoAPI';

export class OotBossRushClient {

    @InjectCore()
    core!: IOOTCore;
    @ModLoaderAPIInject()
    ModLoader!: IModLoaderAPI;
    kits: Map<number, SceneKit> = new Map<number, SceneKit>();
    volvagia_fix: boolean = false;
    disableWarps: boolean = false;

    healPlayer() {
        if (
            this.core.helper.isTitleScreen() ||
            !this.core.helper.isSceneNumberValid()
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
        OotOnlineAPI_EnableGhostMode();
        let link = 0x0034;
        this.kits.set(link, new SceneKit(link, () => {
            this.core.save.boots.kokiriBoots = true;
            this.core.save.tunics.kokiriTunic = true;
            this.core.save.swords.kokiriSword = true;
        }));
        let gohma = 0x0011;
        this.kits.set(gohma, new SceneKit(gohma, () => {
            setInterval(() => {
                this.core.save.questStatus.displayGoldSkulltulas = true;
                this.core.save.questStatus.goldSkulltulas = this.core.save.questStatus.goldSkulltulas + 1;
            }, 60 * 1000);
            // Equipment
            this.core.save.shields.dekuShield = true;
            // Inventory
            // Bullet Bag
            this.core.save.inventory.bulletBag = AmmoUpgrade.BASE;
            this.core.save.inventory.fairySlingshot = true;
            this.core.save.inventory.dekuSeeds = UpgradeCountLookup(InventoryItem.FAIRY_SLINGSHOT, this.core.save.inventory.bulletBag);
            // Deku Nuts
            this.core.save.inventory.dekuNutsCapacity = AmmoUpgrade.BASE;
            this.core.save.inventory.dekuNutsCount = UpgradeCountLookup(InventoryItem.DEKU_NUT, this.core.save.inventory.dekuNutsCapacity);
            this.core.save.inventory.dekuNuts = true;
            // Deku Sticks.
            this.core.save.inventory.dekuSticksCapacity = AmmoUpgrade.BASE;
            this.core.save.inventory.dekuSticksCount = UpgradeCountLookup(InventoryItem.DEKU_STICK, this.core.save.inventory.dekuSticksCapacity);
            this.core.save.inventory.dekuSticks = true;
        }));
        let dodongo = 0x0012;
        this.kits.set(dodongo, new SceneKit(dodongo, () => {
            this.core.save.inventory.ocarina = Ocarina.FAIRY_OCARINA;
            this.core.save.questStatus.zeldasLullaby = true;
            this.core.save.questStatus.eponasSong = true;
            this.core.save.questStatus.sunsSong = true;
            this.core.save.questStatus.sariasSong = true;
            this.core.save.inventory.strength = Strength.GORON_BRACELET;
            this.core.save.shields.hylianShield = true;
            this.core.save.inventory.bombs = true;
            this.core.save.inventory.bombBag = AmmoUpgrade.BASE;
            this.core.save.inventory.bombsCount = UpgradeCountLookup(InventoryItem.BOMB, this.core.save.inventory.bombBag);
            this.core.save.inventory.bottle_1 = InventoryItem.BOTTLED_FAIRY;
            this.core.save.inventory.childTradeItem = InventoryItem.ZELDAS_LETTER;
        }));
        let barinade = 0x0013;
        this.kits.set(barinade, new SceneKit(barinade, () => {
            this.core.save.inventory.boomerang = true;
            this.core.save.inventory.swimming = ZoraScale.SILVER;
            this.core.save.inventory.bottle_2 = InventoryItem.BOTTLED_FAIRY;
            this.core.save.magic_meter_size = Magic.NORMAL;
            this.core.save.magic_current = MagicQuantities.NORMAL;
        }));
        let tot = 0x0043;
        this.kits.set(tot, new SceneKit(tot, () => {
            if (this.core.save.questStatus.goldSkulltulas <= 5) {
                this.core.save.swords.biggoronSword = true;
            }
            this.core.save.questStatus.songOfTime = true;
            this.core.save.magic_meter_size = Magic.NORMAL;
            this.core.save.magic_current = MagicQuantities.NORMAL;
            this.core.save.inventory.bombsCount = UpgradeCountLookup(InventoryItem.BOMB, this.core.save.inventory.bombBag);
        }));
        let phantom = 0x0014;
        this.kits.set(phantom, new SceneKit(phantom, () => {
            this.core.save.swords.masterSword = true;
            this.core.save.inventory.adultTradeItem = InventoryItem.POCKET_EGG;
            this.core.save.inventory.bottle_3 = InventoryItem.BOTTLED_FAIRY;
            this.core.save.inventory.fairyBow = true;
            this.core.save.inventory.quiver = AmmoUpgrade.BASE;
            this.core.save.inventory.arrows = UpgradeCountLookup(InventoryItem.FAIRY_BOW, this.core.save.inventory.quiver);
            this.core.save.inventory.hookshot = Hookshot.HOOKSHOT;
            this.core.save.questStatus.minuetOfForest = true;
            this.core.save.questStatus.songOfStorms = true;
        }));
        let volvagia = 0x0015;
        this.kits.set(volvagia, new SceneKit(phantom, () => {
            if (!this.volvagia_fix) {
                this.core.commandBuffer.runWarp(0x0305, 0x0, () => {
                    this.healPlayer();
                });
                this.volvagia_fix = true;
                return;
            }
            this.core.save.inventory.megatonHammer = true;
            this.core.save.questStatus.boleroOfFire = true;
            this.core.save.tunics.goronTunic = true;
            this.core.save.inventory.bombchus = true;
            setTimeout(() => {
                this.core.save.inventory.bombchuCount = 20;
            }, 3 * 1000);
            this.core.save.inventory.bottle_4 = InventoryItem.BOTTLED_FAIRY;
        }));
        let morpha = 0x0016;
        this.kits.set(morpha, new SceneKit(morpha, () => {
            this.core.save.inventory.hookshot = Hookshot.LONGSHOT;
            this.core.save.boots.ironBoots = true;
            this.core.save.questStatus.serenadeOfWater = true;
            this.core.save.tunics.zoraTunic = true;
        }));
        let bongo = 0x0018;
        this.kits.set(bongo, new SceneKit(bongo, () => {
            this.core.save.questStatus.nocturneOfShadow = true;
            this.core.save.boots.hoverBoots = true;
            this.core.save.inventory.fireArrows = true;
            this.core.save.inventory.iceArrows = true;
            this.core.save.inventory.lensOfTruth = true;
        }));
        let twinrova = 0x0017;
        this.kits.set(twinrova, new SceneKit(twinrova, () => {
            this.core.save.questStatus.requiemOfSpirit = true;
            this.core.save.shields.mirrorShield = true;
            this.core.save.inventory.strength = Strength.SILVER_GAUNTLETS;
        }));
        let ganondorf = 0x0019;
        this.kits.set(ganondorf, new SceneKit(ganondorf, () => {
            this.core.save.inventory.strength = Strength.GOLDEN_GAUNTLETS;
            this.core.save.inventory.lightArrows = true;
            this.disableWarps = true;
        }));
    }

    @onTick()
    onTick(frame: number) {
    }

    @EventHandler(OotEvents.ON_SCENE_CHANGE)
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
                this.core.commandBuffer.runWarp(0x0413, 0x0, () => { });
                return;
            }
            // Bongo Blue Warp -> Twinrova
            if (scene === 0x0053) {
                this.core.commandBuffer.runWarp(0x008D, 0x0, () => { });
                return;
            }
            // Twinrova Blue Warp -> Ganondorf
            if (scene === 0x005C) {
                this.core.commandBuffer.runWarp(0x041F, 0x0, () => { });
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