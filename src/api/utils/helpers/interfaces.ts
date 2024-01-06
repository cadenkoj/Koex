export type Friend = Required<PartialFriend>;
export interface PartialFriend {
    accountId: string;
    groups?: any[];
    mutual: number;
    alias?: string;
    note?: string;
    favorite: boolean;
    created: Date;
}
