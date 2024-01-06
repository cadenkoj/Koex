export enum FortniteProfile {
    athena,
    common_core,
    campaign,
    theater0,
    theater1,
    theater2,
    outpost0,
    collections,
    collection_book_people0,
    collection_book_schematics0,
    metadata,
    common_public,
    creative,
    recycle_bin
}

export enum MCPOperation {
    QueryPublicProfile,
    QueryProfile,
    ClaimLoginReward,
    ClientQuestLogin,
    PopulatePrerolledOffers,
    PurchaseCatalogEntry,
    FortRerollDailyQuest,
    SetMtxPlatform,
    RecycleItemBatch,
    RecycleItem,
    RefreshExpeditions,
    PurchaseHomebaseNode,
    OpenCardPackBatch,
    OpenCardPack,
    UnslotAllWorkers,
    UnassignAllSquads,
    TransmogItem,
    SkipTutorial,
    ModifyMission,
    IssueFriendCode,
    IncrementNamedCounterStat,
    GetMcpTimeForLogin,
    EquipCharCosmetic,
    EndPrimaryMission,
    EarnScore,
    ConvertItem,
    ConsumeItems,
    CollectExpedition,
    ClaimMissionAlertRewards,
    ClaimCollectionBookRewards,
    ClaimCollectedResources,
    AssignWorkerToSquadBatch,
    AssignWorkerToSquad,
    ApplyAlteration,
    ActivateConsumable,
    SetAffiliateName,
    ClaimMfaEnabled,
    SetLoadoutName,
    SetActiveHeroLoadout,
    SetHomebaseName,
    PurchaseOrUpgradeHomebaseNode,
    AbandonExpedition,
    UpdateOutpostCore,
    UpdateDeployableBaseTierProgression,
    CreateOrUpgradeOutpostItem,
    CreateDeployableBaseItem,
    UpgradeSlottedItem,
    ConvertSlottedItem,
    ClaimCollectionBookPageRewards,
    SetBattleRoyaleBanner,
    EndBattleRoyaleGame,
    EquipBattleRoyaleCustomization,
    UpdateBuildingLevelAndRating,
    UnloadWarehouse,
    DestroyWorldItems,
    StorageTransfer,
    PurchaseResearchStatUpgrade,
    ClaimDifficultyIncreaseRewards,
    SetItemArchivedStatusBatch
}

export interface AvatarResponseData {
    accountId: string;
    namespace: string;
    avatarId: string;
}

export interface ProfileItemData {
    templateId: string;
    attributes: {
        [key: string]: any;
    };
    quantity: number;
}

export interface CampaignProfileData {
    node_costs: Partial<{
        homebase_node_default_page: {
            'Token:homebasepoints': number;
        };
        research_node_default_page: {
            'Token:homebasepoints': number;
        };
    }>;
    use_random_loadout: boolean;
    mission_alert_redemption_record: Partial<{
        claimData: {
            missionAlertId: string;
            redemptionDateUtc: string;
            evictClaimDataAfterUtc: string;
        }[];
    }>;
    rewards_claimed_post_max_level: number;
    selected_hero_loadout: string;
    loadouts: string[];
    collection_book: Partial<{
        maxBookXpLevelAchieved: number;
    }>;
    mfa_reward_claimed: boolean;
    quest_manager: Partial<{
        dailyLoginInterval: string;
        dailyQuestRerolls: number;
        questPoolStats: {
            poolStats: {
                poolName: string;
                nextRefresh: string;
                rerollsRemaining: number;
                questHistory: string[];
            }[];
            dailyLoginInterval: string;
            poolLockouts: {
                poolLockouts: {
                    lockoutName: string;
                }[];
            };
        };
    }>;
    legacy_research_points_spent: number;
    gameplay_stats: {
        statName: string;
        statValue: number;
    }[];
    permissions: any[];
    unslot_mtx_spend: number;
    twitch: any;
    client_settings: Partial<{
        pinnedQuestInstances: any[];
    }>;
    research_levels: Partial<{
        technology: number;
        offense: number;
        fortitude: number;
        resistance: number;
    }>;
    level: number;
    xp_overflow?: number;
    latent_xp_marker: string;
    event_currency?: {
        templateId: string;
        cf: number;
    };
    inventory_limit_bonus: number;
    matches_played: number;
    xp_lost: number;
    mode_loadouts: any[];
    last_applied_loadout: string;
    daily_rewards: Partial<{
        nextDefaultReward: number;
        totalDaysLoggedIn: number;
        lastClaimDate: string;
        additionalSchedules: {
            [key: string]: {
                rewardsClaimed: number;
                claimedToday: boolean;
            };
        };
    }>;
    xp?: number;
    packs_granted: number;
    active_loadout_index: number;
}

export enum MtxPlatform {
    Epic,
    PSN,
    Live,
    Shared,
    EpicPC,
    EpicPCKorea,
    IOSAppStore,
    EpicAndroid,
    Nintendo,
    WeGame,
    Samsung
}

export interface AthenaProfileData {
    use_random_loadout: boolean;
    past_seasons?: {
        seasonNumber: number;
        numWins: number;
        numHighBracket: number;
        numLowBracket: number;
        seasonXp: number;
        seasonLevel: number;
        bookXp: number;
        bookLevel: number;
        purchasedVIP: boolean;
        numRoyalRoyales: number;
    }[];
    season_match_boost: number;
    loadouts: string[];
    mfa_reward_claimed: boolean;
    rested_xp_overflow: number;
    quest_manager: {
        dailyLoginInterval: Date;
        dailyQuestRerolls: number;
    };
    book_level: number;
    season_num: number;
    creative_dynamic_xp: {
        timespan: number;
        bucketXp: number;
        bankXp: number;
        bankXpMult: number;
        boosterBucketXp: number;
        boosterXpMult: number;
        dailyExcessXpMult: number;
        currentDayXp: number;
        currentDay: number;
    };
    vote_data: Partial<{
        electionId: string;
        voteHistory: {
            [key: string]: {
                voteCount: number;
                firstVoteAt: Date;
                lastVoteAt: Date;
            };
        };
        votesRemaining: number;
        lastVoteGranted: Date;
    }>;
    alien_style_points: number;
    lifetime_wins: number;
    party_assist_quest: string;
    purchased_battle_pass_tier_offers?: {
        id: string;
        count: number;
    }[];
    rested_xp_exchange: number;
    pinned_quest?: string;
    level: number;
    rested_xp_mult: number;
    accountLevel: number;
    last_applied_loadout: string;
    season_friend_match_boost: number;
    last_match_end_datetime: Date;
    last_stw_accolade_transfer_datetime: Date;
}

export interface CoreProfileData {
    survey_data: Partial<{
        allSurveysMetadata: {
            numTimesCompleted: number;
            lastTimeCompleted: Date;
        };
        metadata: {
            [key: string]: {
                numTimesCompleted: number;
                lastTimeCompleted: Date;
            };
        };
    }>;
    subs: Partial<{
        progressables: {
            [key: string]: {
                acquiredDate: Date;
                nextStageRewardDate: Date;
                stage: number;
            };
        };
    }>;
    intro_game_played: boolean;
    ban_status: Partial<{
        bRequiresUserAck: boolean;
        banReasons: string[];
        bBanHasStarted: boolean;
        banStartTimeUtc: Date;
        banDurationDays: number;
        exploitProgramName: string;
        additionalInfo: string;
        competitiveBanReason: string;
    }>;
    mtx_purchase_history: Partial<{
        refundsUsed: number;
        refundCredits: number;
        tokenRefreshReferenceTime: Date;
        purchases: {
            purchaseId: string;
            offerId: string;
            purchaseDate: Date;
            freeRefundEligible: boolean;
            fulfillments: any[];
            lootResult: {
                itemType: string;
                itemGuid: string;
                itemProfile: string;
                quantity: number;
            }[];
            totalMtxPaid: number;
            metadata: any;
            gameContext: string;
        }[];
    }>;
    undo_cooldowns: {
        offerId: string;
        cooldownExpires: Date;
    }[];
    mtx_affiliate_set_time: Date;
    current_mtx_platform: keyof typeof MtxPlatform;
    mtx_affiliate: string;
    weekly_purchases: {
        lastInterval: Date;
        purchaseList: {
            [key: string]: number;
        };
    };
    daily_purchases: {
        lastInterval: Date;
        purchaseList: {
            [key: string]: number;
        };
    };
    ban_history: Partial<{
        banCount: {
            [key: string]: number;
        };
        banTier: {
            [key: string]: number;
        };
    }>;
    in_app_purchases: {
        receipts: string[];
        ignoredReceipts: string[];
        fulfillmentCounts: {
            [key: string]: number;
        };
        refreshTimers: {
            [key: string]: {
                nextEntitlementRefresh: Date;
            };
        };
    };
    forced_intro_played: string;
    undo_timeout: string;
    monthly_purchases: {
        lastInterval: Date;
        purchaseList: {
            [key: string]: number;
        };
    };
    allowed_to_send_gifts: boolean;
    mfa_enabled: boolean;
    allowed_to_receive_gifts: boolean;
    mtx_affiliate_id: string;
    gift_history: Partial<{
        num_sent: number;
        sentTo: {
            [key: string]: Date;
        };
        num_received: number;
        receivedFrom: {
            [key: string]: Date;
        };
        gifts: string[];
    }>;
}

export interface PublicProfileData {
    banner_color: string;
    homebase_name: string;
    banner_icon: string;
}

export type ProfileAttributes = AthenaProfileData | CampaignProfileData | CoreProfileData | PublicProfileData;

export interface MCPResponse<T extends ProfileAttributes> {
    profileRevision: number;
    profileId: string;
    profileChangesBaseRevision: number;
    profileChanges: {
        changeType: string;
        profile: ProfileData<T>;
    }[];
    profileCommandRevision: number;
    serverTime: Date;
    responseVersion: number;
    notifications: Partial<{
        type: string;
        primary: boolean;
        daysLoggedIn: number;
        items: {
            itemType: string;
            itemGuid: string;
            itemProfile: string;
            quantity: number;
        }[];
    }>[];
}

export interface ProfileData<T extends ProfileAttributes> {
    _id: string;
    created: string;
    updated: string;
    rvn: number;
    wipeNumber: number;
    accountId: string;
    profileId: string;
    version: string;
    items: {
        [key: string]: ProfileItemData;
    };
    stats: {
        attributes: T;
    };
}
