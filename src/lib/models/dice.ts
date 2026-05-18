export enum DieType {
    D4 = 4,
    D6 = 6,
    D8 = 8,
    D10 = 10,
    D12 = 12,
    D20 = 20,
    D100 = 100,
}

export enum RollType {
    Attack,
    Damage,
}

export enum AdvantageState {
    Normal,
    Advantage,
    Disadvantage,
}

export interface RollResult {
    total: number;
    raw: number[];
}
export interface AttackRollResult extends RollResult {
    isCriticalHit: boolean;
    isCriticalMiss: boolean;
    total: number;
    selectedRollIndex: number;
    raw: number[];
}
export const isAttackRollResult = (result: RollResult | null): result is AttackRollResult => {
    return (
        result !== undefined &&
        (result as AttackRollResult).isCriticalHit !== undefined &&
        (result as AttackRollResult).isCriticalMiss !== undefined
    );
};
