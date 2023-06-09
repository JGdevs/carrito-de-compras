import {createContext,useContext,useState} from 'react';
import ShoppingCart from '../components/ShoppingCart';
import {useSessionStorage} from '../hooks/useSessionStorage';

type ShoppingCartProviderProps = {

	children:ReactNode

}

type ShoppingCartContext = {

	openCart: () => void
	closeCart: () => void
	getItemQuantity: (id:number) => number
	increaseCartQuantity: (id:number) => void
	decreaseCartQuantity: (id:number) => void
	removeFromCart: (id:number) => void
	cartQuantity:number
	cartItems:CartItem[]

}

type CartItem = {

	id:number 
	quantity:number

} 

const ShoppingCartContext = createContext({} as ShoppingCartContext),

useShoppingCart = () => useContext(ShoppingCartContext),

ShoppingCartProvider = ({children}:ShoppingCartProviderProps) => {

	const [cartItems,setCartItems] = useSessionStorage<CardItem[]>('shopping-cart',[]),

	[isOpen,setIsOpen] = useState(false),

	cartQuantity = cartItems.reduce((quantity,item) => item.quantity + quantity,0),

	openCart = () => setIsOpen(true),

	closeCart = () => setIsOpen(false);

	function getItemQuantity (id:number) {

		return cartItems.find(item => item.id === id)?.quantity || 0;

	} 

	function increaseCartQuantity(id:number) {

		setCartItems(currItems => {

			if(currItems.find(item => item.id === id) == null) {

				return [...currItems,{id,quantity:1}]

			}

			else {

				return currItems.map(item => {

					if(item.id === id) {

						return {...item,quantity:item.quantity + 1}

					}

				else return item;

				})

			}

		}) 

	}

	function decreaseCartQuantity (id:number) {

		setCartItems(currItems => {

			if(currItems.find(item => item.id === id)?.quantity === 1) {

				return currItems.filter(item => item.id !== id)

			}

			else {

				return currItems.map(item => {

					if(item.id === id) {

						return {...item,quantity:item.quantity - 1}

					}

				else return item;

				})

			}

		}) 

	}

	function removeFromCart (id:number) {

		setCartItems(currItems => {

			return currItems.filter(item => item.id !== id)
			
		})
	}

	const data = {

		getItemQuantity,
		increaseCartQuantity,
		decreaseCartQuantity,
		removeFromCart,
		cartItems,
		cartQuantity,
		openCart,
		closeCart

	}

	return (

		<ShoppingCartContext.Provider value={data}>
			
			{children}

			{isOpen && <ShoppingCart isOpen={isOpen}/>}

		</ShoppingCartContext.Provider>

	)

}

export default useShoppingCart;
export {ShoppingCartProvider};