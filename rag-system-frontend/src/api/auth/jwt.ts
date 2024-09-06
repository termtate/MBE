class Token {
  private _value: string | null = null
  get value() {
    return this._value
  }

  hasToken(): boolean {
    return this._value != null
  }

  setToken(value: string) {
    console.log(`set token ${value}`)
    this._value = value
  }

  clearToken() {
    console.log(`clear token ${this._value}`)
    this._value = null
  }
}

export const token = new Token()
