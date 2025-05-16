export interface ReeBalanceElectricoResponseDto {
  data: {
    type: string;
    id: string;
    attributes: {
      title: string;
      'last-update': string;
      description: string;
    };
    meta: {
      'cache-control': {
        cache: string;
        expireAt: string;
      };
    };
  };
  included: Array<{
    type: string;
    id: string;
    attributes: {
      title: string;
      'last-update': string;
      description?: string;
      magnitude: any;
      content: Array<{
        type: string;
        id: string;
        groupId: string;
        attributes: {
          title: string;
          description?: string;
          color: string;
          icon: any;
          type?: string;
          magnitude: any;
          composite: boolean;
          'last-update': string;
          values: Array<{
            value: number;
            percentage: number;
            datetime: string;
          }>;
          total: number;
          'total-percentage': number;
        };
      }>;
    };
  }>;
}
