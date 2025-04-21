import { VscColorMode } from "react-icons/vsc";
import { IoHelpCircleOutline } from "react-icons/io5";
import { Flex, Text, IconButton, Popover, Portal } from "@chakra-ui/react";
import { osName } from "react-device-detect";
import { useColorMode } from "../components/ui/color-mode"

const popoverTexts = [
  ' + P → π',
  ' + S → sin',
  ' + C → cos',
  ' + T → tan',
  ' + L → ln',
  ' + G → log',
  ' + Q → √'
]

function Header() {
  const { toggleColorMode } = useColorMode()

  return (
    <Flex justifyContent={'space-between'} padding={'12px 24px'} alignItems={'center'}>
      <Text fontSize={'2xl'}>Calculator</Text>
      <Flex gap={'16px'}>
        <Popover.Root>
        <Popover.Trigger asChild>
          <IconButton variant="outline">
            <IoHelpCircleOutline />
          </IconButton>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content>
              <Popover.Arrow />
              <Popover.Body>
                <Popover.Title fontWeight="600" fontSize={20}>Hot Keys</Popover.Title>
                {popoverTexts.map((i) => {
                  return <Text my="4" key={popoverTexts.indexOf(i)}>
                    {osName === 'Mac OS' ? '⌘' : 'Ctrl'}{i}
                  </Text>
                })}
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
      <IconButton variant="outline" onClick={toggleColorMode} aria-label="Toggle Color Mode">
        <VscColorMode />
      </IconButton>
      </Flex>
    </Flex>
  )
}

export default Header