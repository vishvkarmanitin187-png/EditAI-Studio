package com.example.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.UserProfile
import com.example.ui.StudioViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MonetizationScreen(
    viewModel: StudioViewModel,
    userProfile: UserProfile,
    onBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Starter Unlock & Pro Plan", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack, modifier = Modifier.testTag("back_button")) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Status Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = if (userProfile.isPro) Color(0xFFE8F5E9) else MaterialTheme.colorScheme.errorContainer)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = if (userProfile.isPro) "🎉 PRO PLAN ACTIVE" else "⚠️ STARTER EDITION LOCKED",
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = if (userProfile.isPro) Color(0xFF2E7D32) else MaterialTheme.colorScheme.onErrorContainer
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = if (userProfile.isPro) "Enjoy unlimited 4K exports, no ads, and full AI access." else "Unlock all professional features with ₹10 Starter or by watching rewarded ads.",
                        fontSize = 13.sp
                    )
                }
            }

            // Option 1: ₹10 Starter Unlock
            Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp)) {
                Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Bolt, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("₹10 Instant Starter Unlock", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                    Text("Instant lifetime unlock for starter features and premium video filters. (TODO_CONFIGURE_PLAY_BILLING)", fontSize = 12.sp, color = Color.Gray)
                    Button(
                        onClick = { viewModel.unlockStarterWithRupees() },
                        modifier = Modifier.fillMaxWidth().testTag("unlock_starter_button")
                    ) {
                        Text("Pay ₹10 & Unlock Now")
                    }
                }
            }

            // Option 2: Watch 10 Rewarded Ads
            Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp)) {
                Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.PlayCircle, contentDescription = null, tint = MaterialTheme.colorScheme.secondary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Watch Rewarded Ads (${userProfile.rewardedAdsWatched}/10)", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                    Text("Watch user-initiated rewarded ads to unlock Pro without paying. (TODO_CONFIGURE_REWARDED_ADS)", fontSize = 12.sp, color = Color.Gray)
                    Button(
                        onClick = { viewModel.watchRewardedAdForStarter() },
                        modifier = Modifier.fillMaxWidth().testTag("watch_ad_button"),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary)
                    ) {
                        Text("Watch Rewarded Ad (+1)")
                    }
                }
            }

            // Option 3: Pro Plan Subscription
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
            ) {
                Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Star, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("EditAI Studio PRO Plan", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                    Text("• Zero Ads\n• 4K Ultra HD Export\n• Unlimited AI Credits & Voiceovers\n• All Premium Templates", fontSize = 13.sp)
                    Button(
                        onClick = { viewModel.upgradeToPro() },
                        modifier = Modifier.fillMaxWidth().testTag("upgrade_pro_button")
                    ) {
                        Text("Upgrade to PRO (₹299/mo)")
                    }
                }
            }
        }
    }
}
