export const ROLE_OPTIONS = ['Reader', 'Admin', 'TerritoryServant'] as const;

export const ROLE_LABEL_MAP: Record<string, string> = {
  Reader: 'Somente Leitura',
  Admin: 'Administrador',
  TerritoryServant: 'Servo Território'
};
