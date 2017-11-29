// import { argv } from 'yargs'

const config = {
  env: process.env.NODE_ENV,
  /**
   * Project Structure
   */

  src: 'src',
  public: 'public',
  test: 'tests',

  /**
   * server configuration
   */
  host: 'localhost',
  port: process.env.PORT || 3000
}

export default config
