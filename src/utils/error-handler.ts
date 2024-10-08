// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { colors } from '../constants/colors'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { MELON_DIR } from '../constants'
import { log } from '../log'

export const errorHandler = (error: Error, isUnhandledRej: boolean): never => {
  let cc;

  try {
    cc = readFileSync(resolve(MELON_DIR, 'command')).toString()
    cc = cc.replace(/(\r\n|\n|\r)/gm, '')
  } catch (error) {
    cc = null
  }

  if (!cc) {
    log.error('Something got messed up and the command could not be found. Please retry, or report this issue.')
    process.exit(1)
  }

  console.log(
    `\n   ${colors.red}ERROR${
      colors.reset
    } An error occurred while running command ["${cc
      .split(' ')
      .join('", "')}"]:`
  )
  console.log(
    `\n\t`,
    isUnhandledRej
      ? error.toString().replace(/\n/g, '\n\t ')
      : error.message.replace(/\n/g, '\n\t ')
  )
  if (error.stack || isUnhandledRej) {
    const stack: string[] | undefined = error.stack?.split('\n')

    if (!stack) process.exit(1)

    stack.shift()
    stack.shift()
    console.log(
      `\t`,
      stack
        .join('\n')
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ {4}at /g, '\n\t • ')
    )
  }

  console.log()
  log.info('Exiting due to error.')
  process.exit(1)
}
