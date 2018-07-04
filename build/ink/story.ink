
LIST BarState = (dark),lit
LIST CloakState = (worn), on_hand, hang, on_floor, another_room
LIST Inventory = none, (velvet_cloak)

LIST Rooms = (player),on_foyer_of_the_opera_house, on_Cloakroom, on_foyer_bar

VAR currentInventory = (velvet_cloak)
VAR currentRoom = -> main
VAR score = 0
VAR velvetState = (player)
VAR RoomName = ""

-> main
=== function get(x) 
    ~ currentInventory += x

=== function remove(x) 
    ~ currentInventory -= x

=== function move_to_supporter(ref item_state, new_supporter)
    ~ item_state -= LIST_ALL(Rooms)
    ~ item_state += new_supporter

=== function listObjectsOnFloor()
    {CloakState==on_floor:
    {velvetState == RoomName:
      You can see the velvet cloak lying on the floor.      
    }
  }

=== main ===
Hurrying through the rainswept November night, you're glad to see the bright lights of the Opera House. It's surprising that there aren't more people about but, hey, what do you expect in a cheap demo game...?
*[Start Story] -> foyer_of_the_opera_house

/* Foyer */
== foyer_of_the_opera_house
  ~ RoomName = on_foyer_of_the_opera_house
  ~ currentRoom = -> foyer_of_the_opera_house
  { stopping:
  - You are standing in a spacious hall, splendidly decorated in red and gold, with glittering chandeliers overhead. The entrance from the street is to the north, and there are doorways south and west.
  -
  }
  ~ listObjectsOnFloor()
  #parser
  ->DONE
  = examine_chandeliers_glittering
  {&Beautiful|Flashy|Showy} and glittering chandeliers.
  ->done
  = look_chandeliers_glittering
  Glittering chandeliers.
  ->done
  = look_room_hall_gold_decorated_foyer
  ->examine_room_hall_gold_decorated_foyer
  = examine_room_hall_gold_decorated_foyer
    You are standing in a spacious hall, splendidly decorated in red and gold, with glittering chandeliers overhead. The entrance from the street is to the north, and there are doorways south and west.
    ->done
   = examine_room_hall_gold_decorated
  Splendidly decorated in red and gold, with glittering chandeliers overhead.
  ->done
   = look_entrance_door_doorway
   The entrance from the street is to the north, and there are doorways south and west.
  ->done
   = examine_entrance_doorway
  The entrance from the street is to the north, and there are doorways south and west.
  ->done
  //= examine_cloak_velvet
  //->cloak
  = east
  You can't go that way.
  ->done
  = west
  Cloakroom
  -> Cloakroom
  = north
  You've only just arrived, and besides, the weather outside seems to be getting worse.
  ->done
  = south
    {BarState == lit: 
      Foyer Bar
      -else:
      Darkness
    }
  -> foyer_bar
  = exits
  North, south and west.
  ->done
  = done 
  ->currentRoom         

/*Cloakroom*/
== Cloakroom
~ RoomName = on_Cloakroom
~ currentRoom = -> Cloakroom
 { stopping:
  - The walls of this small room were clearly once lined with hooks, though now only one remains. The exit is a door to the east.
  -
  }
{CloakState == hang: 
  On the small brass hook there is a velvet cloak.
}
~ listObjectsOnFloor()
  #parser
  ->DONE
  //Cloakroom exits
   = look_room_chamber_cloakroom
  The walls of this small room were clearly once lined with hooks, though now only one remains. The exit is a door to the east.
  ->done
  = exits
  East.
  ->done
  = east
  Foyer Of The Opera House
  -> foyer_of_the_opera_house
  = west
  You can't go that way.
  ->done
  = south
  You can't go that way.
  ->done
  = north
  You can't go that way.
  ->done
  = hang_cloak_velvet_black
  {CloakState == worn: 
    You take off the velvet cloak
    You {hang|put} the velvet cloak on the small brass hook.
    ~ remove(velvet_cloak)
    ~ CloakState = hang
  }
  {CloakState == on_hand: 
    You hang the cloak on the small brass hook.
    ~ remove(velvet_cloak)
    ~ CloakState = hang
  }
  ~ BarState = lit
  ~ score++
  -> done
  = look_door 
  ->examine_door
  = examine_door
    The exit is a door to the east. 
  ->done
  = look_walls_room_door
  -> examine_walls_room_door
  = examine_walls_room_door
  The walls of this small room were clearly once lined with hooks, though now only one remains. The exit is a door to the east.
  ->done
  = take_small_brass_hook_hooks
  You can't! They are screwed to the wall.
  ->done
  = look_small_brass_hook_hooks
  ->examine_small_brass_hook_hooks
  = examine_small_brass_hook_hooks
   {CloakState == hang:
      It's just a small brass hook, with a cloak hanging on it. Screwed to the wall.
      -else:
      It's just a small brass hook screwed to the wall.
   }

  ->done
  =done
  ->Cloakroom

== darkness
  ->foyer_bar

== foyer_bar
 {BarState == dark: 
  ~ RoomName = on_foyer_bar
  ~ currentRoom = ->darkness
  { cycle:
    - It is pitch dark, and you can't see a thing.
    - In the dark? You could easily disturb something! 
      ~ score++
    - Blundering around in the dark isn't a good idea! 
      ~ score++
  }
  }
  {BarState == lit:
  - The bar, much rougher than you'd have guessed after the opulence of the foyer to the north, is completely empty. There seems to be some sort of message scrawled in the sawdust on the floor.
     ~ RoomName = on_foyer_bar
   ~ currentRoom = ->foyer_bar
    ~ listObjectsOnFloor()
  }
  #parser
  ->DONE
  //exits
  = east
  You can't go that way.
  ->done
  = west
   You can't go that way.
  -> done
  = north
  Foyer Of The Opera House
  ->foyer_of_the_opera_house
  = south
   You can't go that way.
  -> done
  = exits
  South.
  ->done
  = look_bar
  ->done
  = look_sawdust_floor_message
  ->examine_floor_message_sawdust
  = examine_foye_bar_darkness_dark
    ->done
  = examine_floor_message_sawdust
    {BarState == lit: 
        {score < 2 :
          The message, neatly marked in the sawdust, reads...
          ->you_win
          - else:
           The message has been carelessly trampled, making it difficult to read. You can just distinguish the words...
          ->you_lose
      }
    }
  -> done
  = done
  ->foyer_bar

/* cloak object functions Global Objects */

== examine_cloak_velvet_black
{CloakState == (worn) || CloakState == (on_hand) :
A handsome cloak, of velvet trimmed with satin, and slightly spattered with raindrops. Its blackness is so deep that it almost seems to suck light from the room. 
  {CloakState == (worn):
      (You are wearing the cloak)
  }
  {CloakState == (on_hand):
      (You carry the cloak in your hands.)
  }
}
->currentRoom
== put_on_cloak_velvet_black
{CloakState == (on_hand):
    You put on the velvet cloak.
  ~ CloakState = worn
}
{CloakState == (on_floor):
    You pick up and put on the velvet cloak.
  ~ CloakState = worn
}
{CloakState != (worn):
    You are already wearing the velvet cloak.
  ~ CloakState = worn
}
-> currentRoom
== put_off_cloak_velvet_black
-> take_off_cloak_velvet_black
== take_off_cloak_velvet_black
{CloakState == (worn):
    You take off the cloak
  ~ CloakState = on_hand
}
->currentRoom
== drop_cloak_velvet_black
  Droped
  ~ move_to_supporter( velvetState , RoomName) 
  ~ CloakState = on_floor
  ~ remove(velvet_cloak)
->currentRoom
== get_cloak_velvet_black
->take_cloak_velvet_black
== take_cloak_velvet_black
  {velvetState != RoomName: 
    You left the cloak in another rooom
    ~ CloakState = another_room
  }
   {velvetState == RoomName: 
    You pick up the the velvet cloak from the floor.
    ~ CloakState = on_floor
  }
  {CloakState == on_floor:
      {Taken.|You take the cloak from the floor.}
      ~ CloakState = on_hand
      ~ get(velvet_cloak)
  }
  {CloakState == hang:
      You have hanged the cloak on the Cloakroom.
  }
  {CloakState == (worn, on_hand):
      You already have the cloak
  }    
-> currentRoom

=== you_win ===
❤️ YOU WIN ❤️
->END

=== you_lose ===
😯 YOU HAVE LOSE 😯
->END
