/**
 * Mocks Index - 模擬數據統一導出
 * 
 * 注意: 此目錄下的數據僅用於開發和測試
 * 生產環境應設置 NEXT_PUBLIC_USE_MOCKS=false
 */

export * from './schools'
export * from './solutions'
export * from './workflows'

// 環境檢查
export const isMockMode = () => {
  return process.env.NEXT_PUBLIC_USE_MOCKS === 'true'
}
