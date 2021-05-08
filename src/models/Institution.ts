export type Institution = {
    id: number;
    name: string;
    profileImage: string;
    acronym: string;
    logoPath: string;
    website?: string;
    countryId?: number;
    logo?: File[];
}
