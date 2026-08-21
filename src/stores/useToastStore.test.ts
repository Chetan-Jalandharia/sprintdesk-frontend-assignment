import { beforeEach, describe, expect, it } from 'vitest'
import { useToastStore } from './useToastStore'

describe('toast store', () => {
  beforeEach(() => { useToastStore.setState({ toasts: [] }) })
  it('adds and removes a toast', () => { useToastStore.getState().addToast('Saved'); const toast = useToastStore.getState().toasts[0]; expect(toast.message).toBe('Saved'); useToastStore.getState().removeToast(toast.id); expect(useToastStore.getState().toasts).toHaveLength(0) })
})
