

LIST Armario = open, (closed)
LIST Inventory = (none), dog, pencil

VAR currentRoom = 0
VAR currentInventory = () 

->intro

=== function get(x)  
    ~ currentInventory += x 

=== function getCurrentInventory(x) ===
    ~ return LIST_MAX(currentInventory ^ LIST_ALL(x))

/*
=== move_to_supporter(ref item_state, new_supporter)
	 ~ item_state -= LIST_ALL(Supporters)
    ~ item_state += new_supporter
    */
	

/* INTRO */
== intro
Despiertas aturdido.  Después de unos segundos te incorporas en el frío suelo de piedra y ves que estás en un castillo. ¡Ahora recuerdas! Eres reXXe y tu misión es la de matar al vampiro. TIENES que matar al vampiro que vive en la parte superior del castillo...
	*[Continuar]->lobby 


/* ENTRY_DOOR */
== entry_door
~ currentRoom = -> entry_door
{ TURNS_SINCE(->cocina) == 0:
{cycle:
	- Tu misión está aquí!
	-
	}
}
#parser
->DONE
	= north
	Te diriges al lobby
	-> lobby
	= south
	-> done
	= east
	No puede ir hacia el este.
	-> entry_door
	= west
	No puede ir hacia el oeste.
	->done
	/*door actions*/
	= examine_door
	Es una puerta de madera gigantesca. Con calaveras y murciélagos gravados. 
	-> done
	= look_door
	Es una puerta de madera gigantesca. Con calaveras y murciélagos gravados. 
	-> done
	= push_door
	Está cerrada. Es impossible abrirla
	-> done
	= open_door
	Está cerrada. Es impossible abrirla
	-> done


	= done
	->entry_door


/* LOBBY */

== lobby
~ currentRoom = -> lobby
{ TURNS_SINCE(->lobby) == 0:
	{stopping:
	- Estás en el vestíbulo 2 del castillo. El ambiente es muy húmedo y frío. Estás en un pasillo que se extiende hacia el norte. Al sur queda la puerta de entrada al castillo.
	- 
	}
}
#parser //set parser input
->DONE
	/*globals*/
	= take_dog
	~ get(dog)
	coges el perro
	->done
	= take_pencil
	coges el pencil
	~ get(pencil)
	->done
	=examine_door
	{cycle:
	- La puerta de entrada queda un poco lejos para poder examinarla con detenimiento.
	- Si quieres examinar la puerta con detenimiento, prueba a dirigite al sud
	}
	->done
	=look_door
	Puedes ver la puerta de madera gigantesca de entrada al castillo al sud. Coverd by shadows.
	->done
	= examine_castle
	-> globals.castle
	= look_castle
	-> globals.castle
	= ceiling
	The archs fade away in the heights
	->done
	= look
	->done
	= examine_sky
	->globals.sky
	= examine_vestibule
	->done
	= examine_lobby_ceiling
	->lobby.ceiling
	= examine_lobby
	->done
	= examine_chamber
	->done
	= look_lobby
	->done
	= examine_floor
	The floor is great, seems to be swetiy
	->done
	= touch_floor
	Is sleepy. Ancient
	->done
	= examine_ceiling
	->lobby.ceiling

	=examine_look
	Examinas
	->done
	=sharp
	Afilas la estaca con la punta del cuchillo 2.
	->done
	= open_blue_door
	{Armario == closed :
		Click. The door opens
		~Armario = open
		->done
	}
	{Armario == open:
			- The aramrio is already open -> close_armario -> 
		->done
	}
	->done
	= close_armario
	/*+ [close door] Clock! Cierras El aramrio!
	  ~Armario = closed
	+ [leave aramrio open] You leave the aramrio open #parser
	*/
	-> done
	= open_door
	Abres la puerta
	->done
	= wall
	es una pared de la habitacion
	->done
	= examine_wall
	The envelope is strange
	->lobby
	= examine_blue_wall
	The wall is blue
	->lobby

	= exits
	You see an exit to the north and another to the south.
	->done
	//exits: north, south
	= north
	->cocina
	= south
	You go to the south
	->entry_door
	= east
	You can't go to the east
	->done
	= west
	You can't go to the west
	->done
	//exits end

	//once done render lobby agian!
	= done
	-> lobby

/* COCINA */

== cocina
{ TURNS_SINCE(->cocina) == 0:
- Es una cocina muy rara.
}
#parser //set parser input
->DONE
	= wall
	Es una pared de cocina
	->DONE
	= examine__envelope
	Examine envelope form cocina
	->DONE
	= west
	->lobby
	= done
	-> cocina


/* GLOBALS */

== globals

	= castle
	You are inside a big and ancient castle.
	->currentRoom

	= sky
	You cant see the sky. But is dark and shadows.
	->currentRoom






