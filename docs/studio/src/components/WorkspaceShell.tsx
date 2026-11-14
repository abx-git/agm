/** @deprecated Use ProjectPhase */
import { BrowseMode } from './BrowseMode'

export function WorkspaceShell() {
  return <BrowseMode embedded artifactFilter="documentation" />
}